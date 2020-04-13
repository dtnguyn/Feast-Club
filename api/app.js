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
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    console.log("deserializzeeeaseasee")
    findUserByIDToDeserialize(id, done);
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
        await pool.query("INSERT INTO oauth_users VALUES ($1, $2, $3)", [id, email, name]);
        await pool.query("INSERT INTO user_ids VALUES ($1, $2)", [id, email]);

    } catch (e){
        console.log(e);

    } finally {
        console.log("Client disconnected successfully");
    }
}



async function findUserByEmail(email) {
    try{
        console.log("Connect to database successfully!");
        const table = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
        if (table.rows[0] != undefined){ // if there is a match email
            return user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
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
        console.log(table.rows);
        if (table.rows[0] != undefined){ // if there is a match id
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


async function findUserByIDToDeserialize(id, done) {
    try{
        console.log("Connect to database successfully!");
        console.log("id: " + id);
        const table = await pool.query("SELECT id, email, password FROM users WHERE id = $1", [id]);
        const oauthTable = await pool.query("SELECT id, email FROM oauth_users WHERE id = $1", [id]);
        if (table.rows[0] != undefined){ // if there is a match id
            const user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
                password: table.rows[0].password
            }
            return done(null, user);
        } else if(oauthTable.rows[0] != undefined) {
            const user = {
                id: oauthTable.rows[0].id,
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
            console.log(res.body);
            response.send({
                location: latLng,
                restaurants: res.body
            });
        }
        
        
    });
}

function getNearbyRestaurantsByTripsAdvisor(lat,lng, response){
    const req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng");

    req.query({
        "limit": "30",
        "currency": "USD",
        "distance": "2",
        "lunit": "km",
        "lang": "en_US",
        "latitude": lat,
        "longitude": lng
    });

    req.headers({
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "7671356523mshf5fc94df33e09eep1dfeb2jsn2065788690cf"
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        
        const latLng = {
            lat: lat,
            lng: lng
        }
        console.log(res.body);
        response.send(res.body);
    });

            
    //response.send("response");
    
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

async function sendLocalData(id, res){
    try {
        console.log("Try to get the user location");
        const table = await pool.query("SELECT latitude, longitude FROM user_locations WHERE user_id = $1", [id]);
        if(table.rows[0] != undefined){// The current logged in user has already provided location
            getNearbyRestaurantsByTripsAdvisor(table.rows[0].latitude, table.rows[0].longitude, res);
        } else {// The current logged in user has not provided location
            console.log("The user has not provided any location info");
            res.send({
                location: null,
                restaurants: null
            });
            
        }
    } catch (e) {
        console.log("getUserLocation Error: " + e);
    } finally{
        console.log("Finish getting user location");
    }
}

//Routes

/* GET routes */

app.get("/", (req, res) => {
    if(req.isAuthenticated()){
        res.send({
            logInStatus: true,
            message: "",
        })
        console.log("is authenticated");
    } else res.send();
});

app.post('/nearbyrestaurants', function(req, res){
    console.log(req.body);
    if(req.isAuthenticated()){
        getNearbyRestaurantsByTripsAdvisor(req.body.lat, req.body.lng, res);
    }
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


app.listen(port, () => console.log(`Feast Club is running on port ${port}!`));