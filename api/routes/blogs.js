const express = require("express");
const router = express.Router();
const pool = require("../db");
const Multer = require('multer');
const cors = require('cors');
const {ensureAuthenticated} = require("./auth")
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const unirest = require("unirest");


//Database Query
const {
        getBlogsQuery,
        getUserBlogsQuery,
        getUserLikedBlogsQuery,
        searchBlogsPostQuery,
        addBlogsQuery,
        addBlogsLocationQuery,
        editBlogsQuery,
        editBlogsLocationQuery,
        deleteBlogsQuery,
        addHeartQuery,
        deleteHeartQuery,
        getCommentsQuery,
        addCommentsQuery,
        deleteCommentQuery,
        uploadImageToDatabaseQuery
      } = require("../database/blogsQueries")

const storage = new Storage({
    projectId: "feast-club",
    keyFilename: path.join(__dirname, "../feast-club-0c7e5bcc3a76.json")
});


const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


const { uuid } = require('uuidv4');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
  });

router.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    preflightContinue: false,
    credentials: true
}));

const apiResponse = (code, message, status, data) => {
    return({
        code,
        message,
        status,
        data
    })
}

function getImageForCity(city, callback){
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}&image_type=photo&orientation=horizontal&min_width=1000`
    const req = unirest("GET", "https://pixabay.com/api/");
    req.query({
        "key": process.env.PIXABAY_API_KEY,
        "q": "New York",
        "image_type": "photo",
        "orientation": "horizontal",
        "min_width": 1000
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(city)
        callback(res.body)
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

async function addBlogs(restaurant_id, user_id, author_name, name, address, content, city, country, files, callBack){
    try{
        console.log("-----------------------------");
        console.log("Adding Blogs to database...");
        const id = await uuid();
        await pool.query("BEGIN");
        await pool.query( addBlogsQuery, [id, restaurant_id, user_id, author_name, name, address, content, new Date()]);
        await pool.query(addBlogsLocationQuery, [id, city, country]);
        await pool.query("COMMIT");
        uploadImages(id, files, callBack);
    } catch (e){
        console.log(e);
        callBack(false)
        pool.query("ROLLBACK");
    } 
}

async function getBlogPosts(city, country, userID,callBack){
    try{
        console.log("-----------------------------");
        console.log("Fetching blogs from database...");
        const table = await pool.query(getBlogsQuery, [userID, city, country])
        callBack(table.rows);
    } catch (e) {
        console.log(e);
        callBack(null)
    }
}


async function getUserBlogs(userID, callback){
    console.log("-----------------------------");
        console.log("Fetching blogs from database...");
        const userBlogs = await pool.query(getUserBlogsQuery, [userID]);
        const likedBlogs = await pool.query(getUserLikedBlogsQuery, [userID]);
        callback({
            userBlogs: userBlogs.rows,
            likedBlogs: likedBlogs.rows
        });
}


async function searchBlogPosts(textInput, city, country, userID,callBack){
    try{
        console.log("-----------------------------");
        console.log("searching blogs from database...");
        const table = await pool.query(searchBlogsPostQuery, [userID, city, country, `%${textInput}%`]);
        callBack(table.rows);
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Finish searching blogs from database");
        console.log("-----------------------------------");
    }
}


async function editBlogPost(blogID, restaurantID, restaurantName, restaurantAddress, blogContent, city, country, files, callback){
    try {
        console.log("-----------------------------")
        console.log("Editing blog post From database...");
        await pool.query("BEGIN");
        const editBlogResult = await pool.query(editBlogsQuery, [restaurantID, restaurantName, restaurantAddress, blogContent, blogID]);
        const editBlogLocationResult = await pool.query(editBlogsLocationQuery, [city, country, blogID]);
        await pool.query("COMMIT")
        uploadImages(blogID, files, (result) => {
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
    } 
}

async function deleteBlogPost(blogID, callback){
    try{
        console.log("-----------------------------")
        console.log("Deleting Blog post From database...");
        const result = await pool.query(deleteBlogsQuery, [blogID]);
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
        const result = await pool.query(addHeartQuery, [id, blogID, userID]);
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
        const result = await pool.query(deleteHeartQuery, [id]);
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
        const result = await pool.query(addCommentsQuery, [id, blogID, userID, authorName, content, new Date()])
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
        const result = await pool.query(getCommentsQuery, [blogID]);
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

        const result = await pool.query(deleteCommentQuery, [commentID]);
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

function uploadImages(id, files, callback){
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
                callback(false)
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
 
        const result = await pool.query(uploadImageToDatabaseQuery, [id, url])
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



router
    .route("/")
    .get((req, res) => {
        let id = null;
        if(req.isAuthenticated()) id = req.session.passport.user.id;
        getBlogPosts(req.query.city, req.query.country, id,(blogs) => {
            if(blogs != null){
                res.send(apiResponse(200, "Getting blogs successfully.", true, blogs));
            } else {
                res.send(apiResponse(500, "Cannot get blogs.", false, null))
            }
        });
    })
    .post(multer.array('imgCollection'), ensureAuthenticated, (req, res) => {
        const restaurantID = req.query.restaurantID;
            const userID = req.session.passport.user.id;
            const authorName = req.session.passport.user.name;
            const restaurantName = req.query.restaurantName;
            const restaurantAdress = req.query.restaurantAddress;
            const content = req.query.blogContent;
            const city = req.query.city;
            const country = req.query.country;
    
        addBlogs(restaurantID, userID, authorName, restaurantName, restaurantAdress,content, city, country, req.files, (result) =>{
            if(result) res.send(apiResponse(200, "Add blog post successfully.", true, null))
            else res.send(apiResponse(500, "Cannot add blog post.", false, null))
        });
    })
    .patch(multer.array('imgCollection'), ensureAuthenticated, (req, res) => {
        const blogID = req.query.blogID;
            const restaurantID = req.query.restaurantID
            const restaurantName = req.query.restaurantName;
            const restaurantAdress = req.query.restaurantAddress;
            const content = req.query.blogContent;
            const city = req.query.city;
            const country = req.query.country;
            editBlogPost(blogID, restaurantID ,restaurantName, restaurantAdress, content, city, country, req.files, (result) => {
                if(result) res.send(apiResponse(200, "Edit blog post successfully.", true, null))
                else res.send(apiResponse(500, "Cannot edit blog post.", false, null))
            });
    })
    .delete((req, res) => {
        deleteBlogPost(req.query.blogID, (result) => {
            if(result) res.send(apiResponse(200, "Delete blog post successfully.", true, null))
            else res.send(apiResponse(500, "Cannot delete blog post.", false, null))
        });
    })



    router.get('/search', (req, res) => {
        let id = null;
        if(req.isAuthenticated()) id = req.session.passport.user.id;
        searchBlogPosts(req.query.textInput, req.query.city, req.query.country, id,(blogs) => {
            if(blogs != null) res.send(apiResponse(200, "Search blogs successfully.", true, blogs));
            else res.send(apiResponse(500, "Cannot get blogs.", false, null))
        });
    });
    


    router.get('/cityImage', (req, res) => {
        console.log("Getting image... " + req.query.city)
        getImageForCity(req.query.city, (image) => {
            // console.log(image)
            if(image != null) res.send(apiResponse(200, "Get city image successfully.", true, image))
            else res.send(500, "Cannot get city image.", false, null)
        })
    })


    router
        .route("/love")
        .post(ensureAuthenticated, (req, res) => {
            addHeart(req.body.blogID, req.body.userID, (result) => {
                if(result) res.send(apiResponse(200, "Add heart successfully.", true, null));
                else res.send(apiResponse(500, "Cannot add heart.", false, null));
            });
        })
        .delete(ensureAuthenticated, (req, res) => {
            deleteHeart(req.query.blogID, req.query.userID, (result) => {
                if(result) res.send(apiResponse(200, "Delete heart successfully.", true, null));
                else res.send(apiResponse(500, "Cannot delete heart.", false, null))
            });
        })

    router
        .route("/comments")
        .get(ensureAuthenticated, (req, res) => {
            getComments(req.query.blogID, (comments) => {
                if(comments != null) res.send(apiResponse(200, "Getting comments successfully.", true, comments))
                else res.send(apiResponse(500, "Cannot get comments.", false, null))
            })
        })
        .post(ensureAuthenticated, (req, res) => {
            addComment(req.body.blogID, req.body.userID, req.body.authorName, req.body.content, (result) => {
                if(result) res.send(apiResponse(200, "Post comment successfully.", true, null))
                else res.send(apiResponse(500, "Cannot add comment.", false, null))
            })
        })

        .delete(ensureAuthenticated, (req, res) => {
            deleteComment(req.query.commentID, (result) => {
                if(result) res.send(apiResponse(200, "Delete comment successfully.", true, null))
                else res.send(apiResponse(500, "Cannot delete comment.", false, null))
            })
        })
        

    router.get('/user', ensureAuthenticated, (req, res) => {
        let id = req.session.passport.user.id;
        getUserBlogs(id, (userBlogs) => {
            if(userBlogs != null) res.send(apiResponse(200, "Getting user blogs successfully.", true, userBlogs))
            else res.send(apiResponse(500, "Cannot get user blogs.", false, null))
        });
    });



// app.post('/savelocation', (req,res) => {
//     const id = req.session.passport.user;
//     const lat = req.body.lat;
//     const lng = req.body.lng;
//     const city = req.body.city;
//     const state = req.body.state;
//     const country = req.body.country;
//     res.send(addLocation(id, lat, lng, city, state, country));
// })

// app.post('/blogPosts', multer.array('imgCollection'), (req, res, next) => {
    
// })

// app.post('/love', (req, res) => {
//     if(req.isAuthenticated()){
//         addHeart(req.body.blogID, req.body.userID, (result) => {
//             res.send(result);
//         });
//     }
// })



// app.patch('/blogPosts', multer.array('imgCollection'),(req, res, next) => {
    
// })

// app.delete('/blogPosts', (req, res) => {
//     if(req.isAuthenticated()){
//         deleteBlogPost(req.query.blogID, (result) => {
//             res.send(result);
//         });
//     }
// })

// app.delete('/love', (req, res) => {
//     if(req.isAuthenticated()){
//         deleteHeart(req.query.blogID, req.query.userID, (result) => {
//             res.send(result);
//         });
//     }
// })



module.exports = router;