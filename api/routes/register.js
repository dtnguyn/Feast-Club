// // require('dotenv').config();
// // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const router = require('express').Router();

// const { uuid } = require('uuidv4');

// //To hast password before save in database
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// const { Pool } = require('pg')
// const pool = new Pool({
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD,
//     host: process.env.PGHOST,
//     port: process.env.PGPORT,
//     database: process.env.PGDATABASE
// });

// var registerStatus = false;
// var sess;

// // app.use(session({
// //     secret:"rho123yh4wierugfdq3r324rasdfwq3w",
// //     resave: false,
// //     saveUninitialized: false
// // }));

// // app.use(passport.initialize());
// // app.use(passport.session());

// // passport.serializeUser(function(user, done) {
// //     done(null, user.id);
// // });
  
// // passport.deserializeUser(function(id, done) {
// //     User.findById(id, function(err, user) {
// //         done(err, user);
// //     });
// // });


// // passport.use(new GoogleStrategy({
// //     clientID: process.env.CLIENT_ID,
// //     clientSecret: process.env.CLIENT_SECRET,
// //     callbackURL: "http://localhost:5000/auth/google/feast_club",
// //     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
// //   },
// //   function(accessToken, refreshToken, profile, cb) {
// //     findOrCreateUser(accessToken, refreshToken, profile, cb);
// //   }
// // ));


// router.route('/').get((req, res) => {
//     console.log("register")
// });

// router.route('/add').post((req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;

//     bcrypt.hash(password, saltRounds, function(err,hash){
//         if(!err){
//             addUser(name, email, hash, res);
//         } else {+
//             console.log(err);
//         }
//     })
// });

// // app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// // app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/');
// // });

// function sendDataBack(logIn, message, res){
//     const dataSendBack = {
//         logInStatus: logIn,
//         message: message
//     }
//     res.send(dataSendBack);
// }

// async function addUser(name, email, password, res) {
//     try{
//         console.log("Connect to database successfully!")
//         await pool.query("INSERT INTO users VALUES ($1, $2, $3, $4)", [uuid(), name, email, password]);
        
//         sendDataBack(true, "", res);
//     } catch (e){
//         sendDataBack(false, "There's an error: " + e, res);
//     } finally {
//         console.log("Client disconnected successfully");
//     }
// }

// // async function findOrCreateUser(accessToken, refreshToken, profile, cb){
// //     try{
// //         await client.connect();
// //         console.log("Connect to database successfully!")
// //         const table = await client.query("SELECT email FROM users WHERE id = $1", [profile.id]);
// //         console.log(table.rows);
// //     } catch (e){
// //         console.log(e);

// //     } finally {
// //         await client.end();
// //         console.log("Client disconnected successfully");
// //     }
// // }


// module.exports = router;