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
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

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

        setLogInData(true, user.id, "")
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


async function addUser(name, email, password, res) {
    try{
        console.log("Connect to database successfully!")
        await pool.query("INSERT INTO users VALUES ($1, $2, $3, $4)", [uuid(), name, email, password]);
        
        
        res.send({
            registerStatus: true,
            message: ""
        })
    } catch (e){
        res.send({
            registerStatus: false,
            message: "Register Unsuccessfully"
        })
    } finally {
        console.log("Client disconnected successfully");
    }
}

async function addOauthUser(id, email, name) {
    console.log("adding user....")
    try{
        console.log("Connect to database successfully!")
        await pool.query("INSERT INTO oauth_users VALUES ($1, $2, $3)", [id, email, name]);
        console.log("add user successfully")
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
            setLogInData(true, user.id, "");
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
            setLogInData(true, user.id, "");
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

async function sendVerificationEmail(){
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<adron0914@gmail.com>', // sender address
        to: "dtnguyen03@student.ysu.edu", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });

    console.log(info.messageId);

}

function getData(){

    


    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=10.762622,106.660172&radius=1500&type=restaurante&key=" + process.env.GOOGLE_API_KEY;
    
    superagent.get(url).end((err, res) => {
        if (err) { return console.log(err); }
        console.log(res.body);
    });
}

//Routes


app.get("/", (req, res) => {
    console.log("is called");
    //sendVerificationEmail();
    if(req.isAuthenticated()){
        res.send({
            logInStatus: true,
            message: ""
        });
        //getData();
        console.log("is authenticated");
    } else res.send();
})



/* Register routes */

app.get("/register", (req, res)=>{
    console.log("This register route")
})

app.post("/register/add", (req, res) =>{
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
})


/* Sign in routes */

app.post('/signin' ,(req, res, next) =>{
//     // if(req.body.email !== "" && req.body.password !== ""){
//     //     passport.authenticate("local")(req, res, () => {
//     //         req.logIn(user, function (err) { // <-- Log user in
//     //             return res.redirect('/'); 
//     //          });
//     //     });
//     // } else {
//     //     res.send({
//     //         logInStatus: false,
//     //         id: "",
//     //         message: "You have to filled out your email and password!"
//     //     })
//     // }

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

// app.post('/signin', passport.authenticate('local'), function(req, res) {
//     req.logIn(user, function (err) { // <-- Log user in
//         console.log(err);
//         return res.redirect('/'); 
//     });
// });



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/feast_club', 
  passport.authenticate('google'),
  function(req, res) {
    // Successful authentication, redirect home.
    res.status(301).redirect('http://localhost:3000/users/id:' + logInDataSendBack.id);
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email'] }));


app.get('/auth/facebook/feast_club',
  passport.authenticate('facebook'),
  function(req, res) {
    // Successful authentication, redirect home.
    res.status(301).redirect('http://localhost:3000/users/id:' + logInDataSendBack.id);
  });




  

// const registerRouter = require('./routes/register');
// const signinRouter = require('./routes/signin');
// const mainPageRouter = require('./routes/mainPage')

// app.use('/register', registerRouter);
// app.use('/signin', passport.authenticate("local", {session = false}), signinRouter);
// app.use('/mainPage', mainPageRouter);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));