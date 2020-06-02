require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require("./db");
const { uuid } = require('uuidv4');
const axios = require('axios');
const nodemailer = require("nodemailer");
const superagent = require('superagent');
const cities = require('all-the-cities');
const unirest = require("unirest");
const util = require('util');
const testRestaurant = require('./foundRestaurant');
const nearbyrestaurants = require('./nearbyRestaurants');
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const path = require('path');

// Instantiate a storage client
const storage = new Storage({
    projectId: "feast-club",
    keyFilename: path.join(__dirname, "./feast-club-0c7e5bcc3a76.json")
});

//console.log(bucket)

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
  });

  
// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


//To hast password before save in database
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = 5000;
const app = express();

var logInDataSendBack = {
    logInStatus: false,
    id: "",
    message: ""
};


//middleware

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    preflightContinue: false,
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
//passport config
app.use(cookieParser(process.env.SESSION_SECRET))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
        user = await findUserByEmail(email);
        console.log(user);

        if (user === undefined) { 
            console.log("debug1");
            return done(null, false); 
        }
        
        checkPassword = await verifyPassword(user, password)
        if(!checkPassword){
            return done(null, false);
        } 

        //setLogInData(true, user.id, "")
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    console.log("serializzeeeaseasee")
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    console.log("deserializzeeeaseasee")
    findUserByIDToDeserialize(user, done);
});

//Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/feast_club",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("authenticating");
    findUserByIDOrCreate(profile, cb);
  }
));

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/feast_club",
    profileFields: ['id', 'emails', 'name'] 
  },
  function(accessToken, refreshToken, profile, cb) {
    findUserByIDOrCreate(profile, cb);
  }
));

/* Functions */

async function addUser(name, email, password, res) {
    try{
        console.log("Connect to database successfully!")
        id = await uuid();
        await pool.query("INSERT INTO users VALUES ($1, $2, $3, $4)", [id, name, email, password]);
        await pool.query("INSERT INTO user_ids VALUES ($1, $2)", [id, email]);
        res.send({
            registerStatus: true,
            message: ""
        })
    } catch (e){
        console.log(e);
        res.send({
            registerStatus: false,
            message: "Register Unsuccessfully"
        })
    } finally {
        console.log("Client disconnected successfully");
    }
}


async function addOauthUser(id, email, name) {
    try{
        console.log("Connect to database successfully!")
        await pool.query("INSERT INTO oauth_users VALUES ($1, $2, $3)", [id, name, email]);
        await pool.query("INSERT INTO user_ids VALUES ($1, $2)", [id, email]);

    } catch (e){
        console.log(e);
        await pool.query("ROLL BACK");
    } finally {
        console.log("Client disconnected successfully");
    }
}



async function findUserByEmail(email) {
    try{
        console.log("Connect to database successfully!");
        const table = await pool.query("SELECT id, name, email, password FROM users WHERE email = $1", [email]);
        if (table.rows[0] != undefined){ // if there is a match email
            return user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
                name: table.rows[0].name,
                password: table.rows[0].password
            }
        } else { // if there is no match email
            console.log("no founded user")
        }  
    } catch (e){
        console.log(e);
    } finally {
        console.log("Client disconnected successfully");
    }
}

async function findUserByIDOrCreate(profile, done) {
    try{
        console.log("Connect to database successfully!");
        const table = await pool.query("SELECT id, name, email FROM oauth_users WHERE id = $1", [profile.id]);
        console.log("find or create: ", table.rows);
        if (table.rows.length != 0 && table.rows[0] != undefined){ // if there is a match id
            const user = {
                id: table.rows[0].id,
                name: table.rows[0].name,
                email: table.rows[0].email
            }
            //setLogInData(true, user.id, "");
            return done(null, user)
        } else { // if there is no match id
            console.log("no founded user here");
            console.log(profile)
            const user = {
                id: profile.id,
                name: profile.displayName || profile.name.givenName + " " + profile.name.familyName,
                email: profile.emails[0].value
            }
            addOauthUser(user.id, user.email, user.name);
            done(null, user);
        }  
    } catch (e){
        console.log("error here");
        return done(e, false);
    } finally {
        console.log("Client disconnected successfully");
    }
}


async function findUserByIDToDeserialize(user, done) {
    const id = user.id;
    try{
        console.log("Connect to database successfully!");
        console.log("id: " + id);
        const table = await pool.query("SELECT id, name, email, password FROM users WHERE id = $1", [id]);
        const oauthTable = await pool.query("SELECT id, name, email FROM oauth_users WHERE id = $1", [id]);
        if (table.rows.length != 0 && table.rows[0] != undefined){ // if there is a match id
            const user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
                name: table.rows[0].name,
                password: table.rows[0].password
            }
            return done(null, user);
        } else if(oauthTable.rows.length != 0 && oauthTable.rows[0] != undefined) {
            console.log(oauthTable.rows[0].name);
            const user = {
                id: oauthTable.rows[0].id,
                name: oauthTable.rows[0].name,
                email: oauthTable.rows[0].email,
            }
            //setLogInData(true, user.id, "");
            return done(null, user);
        } else { // if there is no match id
            console.log("no founded user");
            done(null, false);
        }  
    } catch (e){
        console.log("error here");
        return done(e, false);
    } finally {
        console.log("Client disconnected successfully");
    }
}

async function verifyPassword(user, typedInPassword){
    try{
        const result = await bcrypt.compare(typedInPassword, user.password);
        return result;
    }catch(e){
        console.log(e);
    }
    
}

function setLogInData(status, id, message){
    logInDataSendBack.logInStatus = true;
    logInDataSendBack.id = id;
    logInDataSendBack.message = message;
}


function getNearbyRestaurantsByGoogle(lat, lng, response){
    console.log(lat, lng);
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ lat + "," + lng + "&radius=1500&type=restaurant&key=" + process.env.GOOGLE_API_KEY;

    superagent.get(url).end((err, res) => {
        if (err) 
            return console.log(err); 
        else {
            const latLng = {
                lat: lat,
                lng: lng
            }
            //console.log(res.body);
            console.log(util.inspect(res.body, {showHidden: false, depth: null}));
            response.send({
                location: latLng,
                restaurants: res.body
            });
        }
        
        
    });
}

function getNearbyRestaurantsByTripsAdvisor(lat,lng, response){
    // var req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng");

    // req.query({
    //     "limit": "30",
    //     "currency": "USD",
    //     "distance": "2",
    //     "lunit": "km",
    //     "lang": "en_US",
    //     "latitude": lat,
    //     "longitude": lng
    // });
    
    // req.headers({
    //     "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
    //     "x-rapidapi-key": process.env.TRIP_ADVISOR_API_KEY
    // });
    
    
    // req.end(function (res) {
    //     if (res.error) throw new Error(res.error);
    //     response.send(res.body);
    // });
     
    response.send(nearbyrestaurants);
    
}


function getSpecificRestaurant(id, lat, lng, response){
    // console.log("Finding restaurants.... " + id);
    // const input = "205 Phan Xich Long Ward 2, Phu Nhuan Dist., Ho Chi Minh City Vietnam"

    // const req = unirest("GET", "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + id + "&fields=name,rating,formatted_phone_number,icon,photo,formatted_address,opening_hours,website,price_level,rating,review,user_ratings_total&key=" + process.env.GOOGLE_API_KEY);


    // req.end(function (res) {
    //     if (res.error) throw new Error(res.error);
    //     console.log(util.inspect(res.body, {showHidden: false, depth: null}))
    //     response.send(res.body);

    // });
    
    //findOrInsertRestaurantsInDatabase("ChIJ_3lMQdAodTERNMFuONVSmWw", testRestaurant);
    response.send(testRestaurant);   
}

// function findOrInsertRestaurantsInDatabase(id, restaurant){
//     try{
//         console.log("----------------------------------");
//         console.log("Finding restaurants in database...");
        
//         const table = await pool.query("SELECT id, name, email, password FROM restaurants WHERE id = $1", [id]);
        
//         if (table.rows[0] != undefined){ // if there is a match id
//             console.log("Restaurant already in database");
//         } else { // if there is no match id
//             console.log("Restaurant is not in database, adding it to db now!");
//             addRestaurant(restaurant);
//         }  
//     } catch (e){
//         console.log("There's an error when finding restaurants in database");
//     } finally {
//         console.log("Finish Finding restaurants in database");
//         console.log("--------------------------------------");
//     }
// }

// function addRestaurant(restaurant){
//     try{
//         console.log("----------------------------------");
//         console.log("Adding restaurants to database...");
//         pool.query("INSERT INTO restaurants VALUES ($1, $2, $3, $4, $5)", 
//             [
//                 id, 
//                 restaurant.name, 
//                 lat,
//                 lng,
//                 restaurant.formatted_address,
//             ]
//         );

//         return true;
//     } catch (e){
//         console.log(e);
//         return false;
//     } finally {
//         console.log("Finish Finding restaurants in database");
//         console.log("--------------------------------------");
//     }
// }

function getRestaurantID(textInput, lat, lng, response){
    const req = unirest("GET", `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${textInput}&inputtype=textquery&fields=place_id,name,geometry&locationbias=circle:1000@${lat},${lng}&key=AIzaSyAEX7J8GBc__Ope0D6V1Ot8N7z-x1R0IPo`);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(util.inspect(res.body, {showHidden: false, depth: null}))
        response.send(res.body.candidates[0]);
    });
}

function getImageForCity(city, response){
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}&image_type=photo&orientation=horizontal&min_width=1000`
    const req = unirest("GET", "https://pixabay.com/api/");
    req.query({
        "key": process.env.PIXABAY_API_KEY,
        "q": city,
        "image_type": "photo",
        "orientation": "horizontal",
        "min_width": 1000
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        response.send(res.body)
    });
}

function addLocation(id, lat, lng, city, state, country){
    try{
        console.log("Connect to database successfully!")
        pool.query("INSERT INTO user_locations VALUES ($1, $2, $3, $4, $5, $6)", [id, lat, lng, city, state, country]);
        return true;
    } catch (e){
        console.log(e);
        return false;
    } finally {
        console.log("Client disconnected successfully");
    }
}

async function addBlogs(restaurant_id, user_id, author_name, name, address, content, city, country, files, next, callBack){
    try{
        console.log("-----------------------------");
        console.log("Adding Blogs to database...");
        const id = await uuid();
        await pool.query("INSERT INTO user_blogs VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, restaurant_id, user_id, author_name, name, address, content, new Date()]);
        await pool.query("INSERT INTO user_blog_location VALUES($1, $2, $3)", [id, city, country]);
        uploadImages(id, files, next, callBack);
    } catch (e){
        console.log(e);
        callBack(false)
        pool.query("ROLLBACK");
    } finally {
        console.log("Finish Adding blogs to database");
        console.log("-----------------------------");
    }
}

async function getBlogPosts(city, country, userID,callBack){
    try{
        console.log("-----------------------------");
        console.log("Fetching blogs from database...");
        const table = await pool.query
        (
            "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
            "(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
            "FROM user_blogs, users " +
            "WHERE user_blogs.user_id = users.id " +
            "UNION ALL " +
            "SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
            "FROM user_blogs, oauth_users " +
            "WHERE user_blogs.user_id = oauth_users.id) as blogs " +

            "INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

            "LEFT JOIN ( " +
            "SELECT heart_count.blog_id, hearts, " +
            "    CASE is_hearted WHEN 1 " +
            "    THEN 1 " +
            "    ELSE 0 " +
            "    END as is_hearted " +
            "FROM( " +
            "    SELECT blog_id, COUNT(blog_id) as hearts " +
            "    FROM user_blog_hearts " +
            "   GROUP BY blog_id " +
            ") as heart_count " +
            "left JOIN ( " +
            "    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
            "        SELECT blog_id " +
            "        FROM user_blog_hearts " +
            "        WHERE user_id = $1 " +
            "        ) as a " +
            "    GROUP BY blog_id " +
            ") as is_hearted " +
            "ON is_hearted.blog_id = heart_count.blog_id " +
            ") as hearts ON hearts.blog_id = id " +

            "LEFT JOIN ( " +
            "SELECT blog_id, COUNT(*) as comments " +
            "FROM user_blog_comments " +
            "GROUP BY blog_id " +
            ") as comments ON comments.blog_id = id  " +

            "LEFT JOIN ( " +
            "    SELECT blog_id, array_agg(image_url) AS images " +
            "    FROM user_blog_images " +
            "    GROUP BY blog_id " +
            "    ) as images ON images.blog_id = id " +

            "WHERE city = $2 AND country = $3 " +
            "ORDER BY date_posted DESC "

        , [userID, city, country]);
        callBack(table.rows);
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Finish fetching blogs from database");
        console.log("-----------------------------------");
    }
}


async function searchBlogPosts(textInput, city, country, userID,callBack){
    try{
        console.log("-----------------------------");
        console.log("searching blogs from database...");
        const table = await pool.query
        (
            "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
            "(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
            "FROM user_blogs, users " +
            "WHERE user_blogs.user_id = users.id " +
            "UNION ALL " +
            "SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
            "FROM user_blogs, oauth_users " +
            "WHERE user_blogs.user_id = oauth_users.id) as blogs " +

            "INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

            "LEFT JOIN ( " +
            "SELECT heart_count.blog_id, hearts, " +
            "    CASE is_hearted WHEN 1 " +
            "    THEN 1 " +
            "    ELSE 0 " +
            "    END as is_hearted " +
            "FROM( " +
            "    SELECT blog_id, COUNT(blog_id) as hearts " +
            "    FROM user_blog_hearts " +
            "   GROUP BY blog_id " +
            ") as heart_count " +
            "left JOIN ( " +
            "    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
            "        SELECT blog_id " +
            "        FROM user_blog_hearts " +
            "        WHERE user_id = $1 " +
            "        ) as a " +
            "    GROUP BY blog_id " +
            ") as is_hearted " +
            "ON is_hearted.blog_id = heart_count.blog_id " +
            ") as hearts ON hearts.blog_id = id " +

            "LEFT JOIN ( " +
            "SELECT blog_id, COUNT(*) as comments " +
            "FROM user_blog_comments " +
            "GROUP BY blog_id " +
            ") as comments ON comments.blog_id = id  " +

            "LEFT JOIN ( " +
            "    SELECT blog_id, array_agg(image_url) AS images " +
            "    FROM user_blog_images " +
            "    GROUP BY blog_id " +
            "    ) as images ON images.blog_id = id " +

            "WHERE city = $2 AND country = $3 AND " +
            "(content LIKE $4 OR restaurant_name LIKE $4 OR restaurant_address LIKE $4 OR author_name LIKE $4)" +
            "ORDER BY date_posted DESC "

        , [userID, city, country, `%${textInput}%`]);
        callBack(table.rows);
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Finish searching blogs from database");
        console.log("-----------------------------------");
    }
}


async function editBlogPost(blogID, restaurantID, restaurantName, restaurantAddress, blogContent, city, country, files, next, callback){
    try {
        console.log("-----------------------------")
        console.log("Editing blog post From database...");
        const editBlogResult = await pool.query
        (
            "UPDATE user_blogs SET " +
            "restaurant_id = $1, " +
            "restaurant_name = $2, " +
            "restaurant_address = $3, " + 
            "content = $4 " +
            "WHERE id = $5 "
        , [restaurantID, restaurantName, restaurantAddress, blogContent, blogID]);
        const editBlogLocationResult = await pool.query
        (
            "UPDATE user_blog_location SET " +
            "city = $1, " +
            "country = $2 " + 
            "WHERE blog_id = $3 "
        , [city, country, blogID]);
        
        uploadImages(blogID, files, next, (result) => {
            if(result && editBlogResult.rowCount == 1 && editBlogLocationResult.rowCount == 1){
                console.log("Successfully edit blog post!")
                callback(true);
            } else {
                throw "Something went wrong when editting blog post!";
            }
        })
        
        
        

    } catch(error){
        console.log("Fail! to edit post");
        console.log(error);
        callback(false);
        pool.query("ROLLBACK");
    } finally {
        console.log("Finishing Editing blog post From database...");
        console.log("-----------------------------");
    }
}

async function deleteBlogPost(blogID, callback){
    try{
        console.log("-----------------------------")
        console.log("Deleting Blog post From database...");
        const result = await pool.query(`DELETE FROM user_blogs WHERE id = '${blogID}' `);
        if(result.rowCount == 1){
            console.log("Successfull!");
            callback(true);
        } else {
            console.log("Fail to delete");
            callback(false);
        }
        
    } catch (e){
        console.log(e);
        client.query("ROLLBACK");
    } finally {
        console.log("Finish Deleting blog post from database");
        console.log("-----------------------------");
    }
}



async function addHeart(blogID, userID, callback){
    try{
        console.log("-----------------------------")
        console.log("Adding Love to database...");
        const id = blogID + userID;
        const result = await pool.query("INSERT INTO user_blog_hearts VALUES ($1, $2, $3)", [id, blogID, userID]);
        if(result.rowCount == 1){
            console.log("Successfull!");
            callback(true);
        } else {
            console.log("Fail to add");
            callback(false);
        }
    } catch (e){
        console.log(e);
        pool.query("ROLLBACK");
    } finally {
        console.log("Finish Adding Love to database");
        console.log("-----------------------------");
    }
}

async function deleteHeart(blogID, userID, callback){
    try{
        console.log("-----------------------------")
        console.log("Deleting Love From database...");
        const id = blogID.concat(userID);
        const result = await pool.query(`DELETE FROM user_blog_hearts WHERE id = '${id}' `);
        if(result.rowCount == 1){
            console.log("Successfull!");
            callback(true);
        } else {
            console.log("Fail to delete");
            callback(false);
        }
        
    } catch (e){
        console.log(e);
        pool.query("ROLLBACK");
    } finally {
        console.log("Finish Deleting Love from database");
        console.log("-----------------------------");
    }
}

async function addComment(blogID, userID, authorName, content, callback){
    try {
        console.log("--------------------------");
        console.log("Adding comment to database");
        
        const id = await uuid();
        const result = await pool.query("INSERT INTO user_blog_comments VALUES($1, $2, $3, $4, $5, $6)", [id, blogID, userID, authorName, content, new Date()])
        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail to add comment");
            callback(false);
        }
    } catch(error) {
        console.log("Fail to add comment!");
        console.log(error);
        callback(false);
    } finally {
        console.log("Finish adding comment to database");
        console.log("----------------------------------")
    }
}

async function getComments(blogID, callback){
    try {
        console.log("--------------------------");
        console.log("Getting comments from database", blogID);

        const result = await pool.query
        (
            "SELECT *, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
            "(SELECT user_blog_comments.id as comment_id, blog_id, user_id, author_name, comment_content, users.avatar, date_posted " +
            "FROM user_blog_comments, users " +
            "WHERE user_id = users.id " +
            "UNION ALL " +
            "SELECT user_blog_comments.id as comment_id, blog_id, user_id, author_name, comment_content, oauth_users.avatar, date_posted " +
            "FROM user_blog_comments, oauth_users " +
            "WHERE user_id = oauth_users.id) as comments " +
            "WHERE blog_id = $1 " +
            "ORDER BY date_posted DESC"
        , [blogID]);
        console.log(result.rows);
        callback(result.rows);

    } catch(error) {
        console.log("Fail to get comment!")
        console.log(error);
    } finally {
        console.log("Finish Getting comments from database");
        console.log("-------------------------------");
    }
}

async function deleteComment(commentID, callback){
    try {
        console.log("---------------------------");
        console.log("Deleting comments from database");

        const result = await pool.query("DELETE FROM user_blog_comments WHERE id = $1", [commentID]);
        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail to delete comment");
            callback(false);
        }

    } catch (error) {  
        console.log("Fail to delete comment!")
        console.log(error);
    } finally {
        console.log("Finish deleting comments from database");
        console.log("---------------------------");
    }
}

function uploadImages(id, files, next, callback){
    if (files.length == 0){
        callback(true);
        return;
    }
    var imageURLs = [];
    const upload = new Promise((resolve, reject) => {
        files.forEach((file, i) => {
            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false
            });
            
            blobStream.on('error', (err) => {
                next(err);
            });
    
            blobStream.on('finish', async () => {
                // The public URL can be used to directly access the file via HTTP.
                console.log(`https://storage.googleapis.com/${bucket.name}/${blob.name}`, i);
                try{
                    await uploadImageToDatabase(id, `https://storage.googleapis.com/${bucket.name}/${blob.name}`, (result) => {
                    if(result) {
                        imageURLs.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                        if (imageURLs.length === files.length) resolve();
                    } else {
                        reject();
                    }
                })
                } catch(err){
                    console.log(err);
                    reject();
                }
                
                
            });
        
            blobStream.end(file.buffer);
        })
    });
   
    upload.then(() => {
        console.log('All done!');
        callback(true);
    });
    
}

async function uploadImageToDatabase(id, url, callback){
    try {
        console.log("--------------------------");
        console.log("Adding image url to database");
 
        const result = await pool.query("INSERT INTO user_blog_images (blog_id, image_url) VALUES($1, $2)", [id, url])
        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail to add images");
            callback(false);
        }
    } catch(error) {
        console.log("Fail to add comment!");
        console.log(error);
        callback(false);
    } finally {
        console.log("Finish adding image to database");
        console.log("----------------------------------")
    }
}

//Routes

/* GET routes */

app.get("/", (req, res) => {
    console.log(req.session.passport.user);
   
    if(req.isAuthenticated()){
        
        res.send({
            logInStatus: true,
            message: "",
            userInfo: {
                id: req.session.passport.user.id,
                name: req.session.passport.user.name,
                email: req.session.passport.user.email
            }
        })
        console.log("is authenticated");
    } else res.send();
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/feast_club', 
  passport.authenticate('google'),
  function(req, res) {
    // Successful authentication, redirect home.
    res.status(301).redirect('http://localhost:3000/mainPage');
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email'] }));


app.get('/auth/facebook/feast_club',
  passport.authenticate('facebook'),
  function(req, res) {
    // Successful authentication, redirect home.
    res.status(301).redirect('http://localhost:3000/mainPage');
  });

app.get('/nearbyrestaurants', function(req, res){
    console.log(req.session);
    console.log(req.query);
    if(req.isAuthenticated()){
        getNearbyRestaurantsByTripsAdvisor(req.query.lat, req.query.lng, res);
    }
});

app.get('/findrestaurantID', function(req, res){
    console.log(req.query)
    if(req.isAuthenticated()){
        getRestaurantID(req.query.textInput, req.query.lat, req.query.lng, res)
    }
})

app.get('/findrestaurant', function(req, res){
    if(req.isAuthenticated()){
        getSpecificRestaurant(req.query.id, req.query.lat, req.query.lng, res)
    }
});

app.get('/cityImage', function(req, res){
    getImageForCity(req.query.city, res)
})

app.get('/blogPosts', (req, res) => {
    let id = null;
    if(req.isAuthenticated())
        id = req.session.passport.user.id;
    getBlogPosts(req.query.city, req.query.country, id,(blogs) => {
        console.log(util.inspect(blogs, {showHidden: false, depth: null}))
        res.send(blogs);
    });
});

app.get('/blogPosts/search', (req, res) => {
    let id = null;
    if(req.isAuthenticated())
        id = req.session.passport.user.id;
    searchBlogPosts(req.query.textInput, req.query.city, req.query.country, id,(blogs) => {
        console.log(util.inspect(blogs, {showHidden: false, depth: null}))
        res.send(blogs);
    });
});

app.get('/comments', (req, res) => {
    if(req.isAuthenticated()){
        getComments(req.query.blogID, (result) => {
            res.send(result);
        })
    }
})

/* POST routes */

app.post("/register", (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err,hash){
        if(!err){
            addUser(name, email, hash, res);
        } else {+
            console.log(err);
        }
    })
});

app.post('/signin' ,(req, res, next) =>{
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            console.log(err);
            return next(err);
        }
        if (!user) { 
            console.log("no user");
            return res.send({
                logInStatus: false,
                message: "Invalid email and/or password!"
            })
        }
        req.logIn(user, function(err) {
            console.log("Before redirect: " + req.session.passport);
            console.log(user);
            if (err) { 
                console.log(err);
                return next(err); 
            }
            return res.redirect('/');
        });
      })(req, res, next);
 });

app.post('/savelocation', (req,res) => {
    const id = req.session.passport.user;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    res.send(addLocation(id, lat, lng, city, state, country));
})

app.post('/blogPosts', multer.array('imgCollection'), (req, res, next) => {
    if(req.isAuthenticated()){
        const restaurantID = req.query.restaurantID;
        const userID = req.session.passport.user.id;
        const authorName = req.session.passport.user.name;
        const restaurantName = req.query.restaurantName;
        const restaurantAdress = req.query.restaurantAddress;
        const content = req.query.blogContent;
        const city = req.query.city;
        const country = req.query.country;

        addBlogs(restaurantID, userID, authorName, restaurantName, restaurantAdress,content, city, country, req.files, next, (result) =>{
            res.send(result);
        });
        // addBlogs(null, null, null, null, null, null, null, null, req.files, next, (result) =>{
        //     res.send(result);
        // });
    } 
})

app.post('/love', (req, res) => {
    if(req.isAuthenticated()){
        addHeart(req.body.blogID, req.body.userID, (result) => {
            res.send(result);
        });
    }
})


app.post('/comments', (req, res) => {
    if(req.isAuthenticated()){
        console.log(req.body.blogID);
        addComment(req.body.blogID, req.body.userID, req.body.authorName, req.body.content, (result) => {
            res.send(result);
        })
    }
})



//Update Routes

app.patch('/blogPosts', multer.array('imgCollection'),(req, res, next) => {
    console.log("editing", req.files);
    if(req.isAuthenticated()){
        console.log(req.body);
        const blogID = req.query.blogID;
        const restaurantID = req.query.restaurantID
        const restaurantName = req.query.restaurantName;
        const restaurantAdress = req.query.restaurantAddress;
        const content = req.query.blogContent;
        const city = req.query.city;
        const country = req.query.country;
        editBlogPost(blogID, restaurantID ,restaurantName, restaurantAdress, content, city, country, req.files, next, (result) => res.send(result));
    }
})


//Delete Routes

app.delete('/blogPosts', (req, res) => {
    if(req.isAuthenticated()){
        deleteBlogPost(req.query.blogID, (result) => {
            res.send(result);
        });
    }
})

app.delete('/love', (req, res) => {
    if(req.isAuthenticated()){
        deleteHeart(req.query.blogID, req.query.userID, (result) => {
            res.send(result);
        });
    }
})

app.delete('/comments', (req, res) => {
    if(req.isAuthenticated()){
        console.log(req.query)
        deleteComment(req.query.commentID, (result) => {
            res.send(result);
        })
    }
})


app.listen(port, () => console.log(`Feast Club is running on port ${port}!`));