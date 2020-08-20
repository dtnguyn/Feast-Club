const express = require("express");
const router = express.Router();
const pool = require("../db");
const cors = require('cors');
const {ensureAuthenticated} = require("./auth")
const Multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {Storage} = require('@google-cloud/storage');
const path = require('path');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
  });

const storage = new Storage({
    projectId: "feast-club",
    keyFilename: path.join(__dirname, "../feast-club-0c7e5bcc3a76.json")
});


const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);



//Database Query
const {
    editUserNameQuery,
    editOauthUserNameQuery,
    editEmailPasswordQuery,
    editAvatarQuery,
    editOauthAvatarQuery
  } = require("../database/userQueries")

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


function uploadAvatar(userID, file, isOauth, callback){
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
        console.log(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
        try{
            editUserAvatar(userID, `https://storage.googleapis.com/${bucket.name}/${blob.name}`, isOauth, callback)
        } catch(err){
            console.log(err);
        }
    });

    blobStream.end(file.buffer);
}

async function editUserName(userID, newName, isOauth, callback){
    try {
        console.log("--------------------------");
        console.log("Editing user name!");
        let result;
        if(isOauth){
            result = await pool.query(editOauthUserNameQuery, [newName, userID])
        } else {
            result = await pool.query(editUserNameQuery,[newName, userID]);
        }   

        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail!");
            callback(false);
        }
       
    } catch(error) {
        console.log("Fail to edit user name!");
        console.log(error);
        callback(false);
    } finally {
        console.log("Finish editing user name");
        console.log("----------------------------------")
    }
}

async function editUserEmailAndPassword(userID, newEmail, newPassword, callback){
    try {
        console.log("--------------------------");
        console.log("Editing user email and password!");
        
        const result = await pool.query
        (editEmailPasswordQuery, [newEmail, newPassword, userID])

        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail!");
            callback(false);
        }
       
    } catch(error) {
        console.log("Fail to edit user email and password!");
        console.log(error);
        callback(false);
    } finally {
        console.log("Finish editing user email and password");
        console.log("----------------------------------")
    }
}



async function editUserAvatar(userID, url, isOauth, callback){
    try {
        console.log("--------------------------");
        console.log("Editing user avatar!");
        console.log(url, userID);
        
        let result;
        if(isOauth === true){
            result = await pool.query
            (editOauthAvatarQuery,[url, userID])
        } else {
            result = await pool.query
            (editAvatarQuery, [url, userID])
        }
        
        if(result.rowCount == 1){
            console.log("Successful!");
            callback(true);
        } else {
            console.log("Fail to edit avatar!");
            callback(false);
        }
       
    } catch(error) {
        console.log("Fail to edit user avatar!");
        console.log(error);
        callback(false);
    } finally {
        console.log("Finish editing user avatar");
        console.log("----------------------------------")
    }
}




router.patch('/edit/userName', ensureAuthenticated,(req, res) => {
    editUserName(req.session.passport.user.id, req.body.userName, req.body.isOauth, (result) => {
        if(result) res.send(apiResponse(200, "Change username successfully.", true, null))
        else res.send(apiResponse(500, "Cannot change username.", false, null))
    });
})

router.patch('/edit/emailAndPassword', ensureAuthenticated, (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        if(!err){
            editUserEmailAndPassword(req.session.passport.user.id, req.body.email, hash, (result) => {
                if(result) res.send(apiResponse(200, "Change email/password successfully.", true, null))
                else res.send(apiResponse(500, "Cannot change email/password.", false, null))
            });
        } else {
            console.log(err);
            res.send(apiResponse(500, "Cannot change email/password.", false, null))
        }
    })
})

router.patch('/edit/avatar', ensureAuthenticated, multer.single('image') ,(req, res) => {
    uploadAvatar(req.session.passport.user.id, req.file, req.query.isOauth, (result) => {
        if(result) res.send(apiResponse(200, "Change avatar successfully.", true, null))
        else res.send(apiResponse(500, "Cannot change avatar.", false, null))
    })
})


module.exports = router;