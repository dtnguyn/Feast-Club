const express = require("express");
const session = require('express-session');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require("../db");
const { uuid } = require('uuidv4');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const { result } = require("../foundRestaurant");
const saltRounds = 10;
const cors = require('cors');


const transporter = nodemailer.createTransport({
    host: "server244.web-hosting.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.HOST_EMAIL, // generated ethereal user
      pass: process.env.HOST_EMAIL_PASSWORD, // generated ethereal password
    },
  });

router.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    preflightContinue: false,
    credentials: true
}));

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));

//passport config
router.use(cookieParser(process.env.SESSION_SECRET))

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
    console.log("SERIALIZING")
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    console.log("DESERIALIZING")
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



/* FUNCTIONS */

const apiResponse = (code, message, status, data) => {
    return({
        code,
        message,
        status,
        data
    })
}

const addUser = async (name, email, password, callback) => {
    try{
        console.log("Adding user...")
        id = await uuid();
        await pool.query("BEGIN")
        await pool.query(
            "INSERT INTO users VALUES ($1, $2, $3, $4)",
            [id, name, email, password]
        )
        await pool.query(
            "INSERT INTO user_ids VALUES ($1, $2)",
            [id, email]
        )
        await pool.query("COMMIT")
        callback(true)
    } catch (e){
        console.log(e);
        pool.query("ROLLBACK");
        callback(false)
    }  
}


const addOauthUser = async (id, email, name, callback) => {
    try{
        console.log("Adding oath user...")

        await pool.query("BEGIN");
        await pool.query("INSERT INTO oauth_users VALUES ($1, $2, $3)", [id, name, email]);
        await pool.query("INSERT INTO user_ids VALUES ($1, $2)", [id, email] );
        await pool.query("COMMIT");
    
        callback(true)
    } catch (e){
        console.log(e);
        pool.query("ROLLBACK");
        callback(false)
    }
}


const findUserByEmail = async (email) => {
    try{
        console.log("Finding user by email...");
        const table = await pool.query("SELECT id, name, email, password, avatar FROM users WHERE email = $1", [email]);
        if (table.rows[0] != undefined){ // if there is a match email
            return user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
                name: table.rows[0].name,
                password: table.rows[0].password,
                avatar: table.rows[0].avatar,
                isOauth: false
            }
        } else { // if there is no match email
            console.log("no founded user " + email)
            return null
        }  
    } catch (e){
        console.log(e);
        return null
    } 
}

async function findUserByIDOrCreate(profile, done) {
    try{
        console.log("Connect to database successfully!");
        const table = await pool.query("SELECT id, name, email, avatar FROM oauth_users WHERE id = $1", [profile.id]);
        console.log("find or create: ", table.rows);
        if (table.rows.length != 0 && table.rows[0] != undefined){ // if there is a match id
            const user = {
                id: table.rows[0].id,
                name: table.rows[0].name,
                email: table.rows[0].email,
                avatar: table.rows[0].avatar,
                isOauth: true
            }
            //setLogInData(true, user.id, "");
            return done(null, user)
        } else { // if there is no match id
            console.log("no founded user here");
            console.log(profile)
            const user = {
                id: profile.id,
                name: profile.displayName || profile.name.givenName + " " + profile.name.familyName,
                email: profile.emails[0].value,
            }
            addOauthUser(user.id, user.email, user.name, (result) => {
                if (result) done(null, user);
            });
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
        console.log("Finding user by Id to deserialize");
        console.log("id: " + id);
        const table = await pool.query("SELECT id, name, email, password FROM users WHERE id = $1", [id]);
        const oauthTable = await pool.query("SELECT id, name, email FROM oauth_users WHERE id = $1", [id]);
        if (table.rows.length != 0 && table.rows[0] != undefined){ // if there is a match id
            const user = {
                id: table.rows[0].id,
                email: table.rows[0].email,
                name: table.rows[0].name,
                password: table.rows[0].password,
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


async function sendEmail(email, code){
    // create reusable transporter object using the default SMTP transport
    try{
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Verify Code" <verification@fcauth.com>', // sender address
            to: email, // list of receivers
            subject: "Use this code to verify your account!", // Subject line
            text: `This is your code: ${code}`  // plain text body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err){
        console.log(err);
    }
    
}

function addMinutesToCurrentTime(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function insertOrUpdateVerifyCode(userId, email, callback){
    try{
        console.log("--------------------------");
        console.log("Inserting new code to database");

        let result = await pool.query ("SELECT * FROM verify_codes WHERE user_id = $1",[userId])
        let code = Math.floor(Math.random() * 899999) + 100000

        if(result.rowCount == 1){
            let table = await pool.query
            (
                "UPDATE verify_codes SET " +
                "code = $1, " +
                "expire_time = $2 " +
                "WHERE user_id = $3"
                , [code, addMinutesToCurrentTime(new Date(), 5), userId]
            )
            if (table.rowCount == 1){
                console.log("Success");
                sendEmail(email, code);
                callback(true)
            } else {
                console.log("Fail: " + table.rowCount)
                callback(false)
            }
        } else if(result.rowCount == 0) {
            let table = await pool.query
            (
                "INSERT INTO verify_codes (user_id, code, expire_time) VALUES($1, $2, $3)"
                , [userId, code, addMinutesToCurrentTime(new Date(), 5)]
            )
            if (table.rowCount == 1){
                console.log("Success");
                sendEmail(email, code);
                callback(true)
            } else {
                console.log("Fail: " + table.rowCount)
                callback(false)
            }
        }
    } catch(error){
        console.log("Fail: " + error)
    }
}


async function verifyCode(userId, code, callback){
    console.log("verify: ", userId, code)
    try{
        console.log("--------------------------");
        console.log("Verifying code the user typed in...");

        let result = await pool.query ("SELECT * FROM verify_codes WHERE user_id = $1 AND code = $2",[userId, code])
        if(result.rowCount == 1){
            console.log("Success!")
            if(result.rows[0].expire_time > new Date()) callback(true)
            else callback(false)
        } else {
            console.log("Fail: " + result.rowCount)
            callback(false)
        }
    } catch(error){
        console.log("Fail: " + error);
        callback(false)
    }
}




/* ROUTES */

router
    .route("/logout")
    .get((req, res) => {
        console.log("Logging out...");
        if(req.isAuthenticated()) {
            req.session.destroy();
            req.logout();
            console.log(req.isAuthenticated());
            if(req.isAuthenticated()) res.send(apiResponse(500, "An error has occured when logging out", false, null))
            else res.send(apiResponse(200, "Logging out succesfully", true, null));
        } else{
            res.send(apiResponse(200, "Logging out succesfully", true, null));
        }
    })

router
    .route("/google")
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router
    .route("/facebook")
    .get(passport.authenticate('facebook', { scope : ['email'] }))

router
    .route("/google/feast_club")
    .get(passport.authenticate('google'), (req, res) => {
        res.status(200).redirect('http://localhost:3000/');
    })

router
    .route("/facebook/feast_club")
    .get(passport.authenticate('facebook'), (req, res) => {
        res.status(200).redirect('http://localhost:3000/');
    })

router
    .route("/verify")
    .get((req, res) => {
        const id = req.query.id
        const email = req.query.email
        console.log("Getting code...", id, email)
        insertOrUpdateVerifyCode(id, email, (result) => {
            if(result) res.send(apiResponse(200, "Insert/Update code successfully.", true, null))
            else res.send(apiResponse(200, "Fail to insert/update verify code ", false, null))
        })
    })
    .post((req, res) => {
        console.log("Checking code...")
        const id = req.body.id
        const code = req.body.code
        verifyCode(id, code, (result) => {
            if(result) res.send(apiResponse(200, "Code verified.", true, null))
            else res.send(apiResponse(200, "Fail to verify code.", false, null));
        })
    })

router
    .route("/verify/email")
    .post(async (req, res) => {
        console.log(req.body.email)
        let user = await findUserByEmail(req.body.email)
        console.log("user info: ", user)
        if(user === null) res.send(apiResponse(200, "User not found!", false, null))
        else res.send(apiResponse(200, "Found user.", true, {id: user.id, email: user.email}))
    })


router
    .route("/register")
    .post((req, res) => {
        console.log("Regiter new account...")
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
    
        bcrypt.hash(password, saltRounds, function(err,hash){
            if(!err){
                addUser(name, email, hash, (result) => {
                    if(result){
                        res.send(apiResponse(200, "Add user sucessfully.", true, null));
                    } else {
                        res.send(apiResponse(500, "Fail to add user.", false, null))
                    }
                    
                });
            } else {
                console.log(err);
            }
        })
    })

router
    .route("/signin")
    .post((req, res, next) => {
        console.log("Signing in...")
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                console.log(err);
                res.send(apiResponse(500, err.message, false, null))
                return next(err);
            }
            if (!user) { 
                console.log("HERE " + user)
                return res.send(apiResponse(400, "Invalid email and/or password!", false, null))
            }
            req.logIn(user, function(err) {
                console.log(user);
                if (err) { 
                    console.log(err);
                    res.send(apiResponse(500, err.message, false, null))
                    return next(err); 
                }
                return res.redirect('/auth');
            });
        })(req, res, next);
    })


    router.get("/", (req, res) => {
        console.log("/ ", req.isAuthenticated());
        if(req.isAuthenticated()){
            console.log("Hello User ", req.session.passport.user);
            const userinfo = {
                id: req.session.passport.user.id,
                name: req.session.passport.user.name,
                email: req.session.passport.user.email,
                avatar: req.session.passport.user.avatar,
                isOauth: req.session.passport.user.isOauth
            }
            res.send(apiResponse(200, "Successfully Authenticated", true, userinfo))
            console.log("is authenticated");
        } else res.send(apiResponse(401, "You haven't logged in!", false, null));
    });

    router
        .route("/test")
        .post((req, res) => {
            console.log("Debugging authentication: " + req.isAuthenticated())
        })
module.exports = {
    auth: router,
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.send(apiResponse(401, "You haven't logged in yet.", false, null))
        
    }
}