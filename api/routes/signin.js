
// const router = require('express').Router();


// const { uuid } = require('uuidv4');

// const app = express();



// const data = {
//     logInStatus: false,
//     id: "",
//     message: "",
//     res: null
// }



// passport.use(new LocalStrategy(
//     async function(email, password) {
//         authenticate(email, password)
//     }
// ));

// // // tell passport how to serialize the user
// // passport.serializeUser((user, done) => {
// //     console.log('Inside serializeUser callback. User id is save to the session file store here')
// //     done(null, user.id);
// //   });
  
// // passport.deserializeUser((id, done) => {
// //     console.log('Inside deserializeUser callback')
// //     console.log(`The user id passport saved in the session file store is: ${id}`)
// //     const user = users[0].id === id ? users[0] : false; 
// //     done(null, user);
// // });





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


// var isLoggedIn = false

// function setData(status, id, message){
//     data.logInStatus = status;
//     data.id = id;
//     data.message = message;
// }


// router.route('/authenticate').post((req, res) => {
//     // sess = req.session;
//     // const email = req.body.email;
//     // const password = req.body.password;
    
//     // authenticate(email, password, res, sess);
//     passport.authenticate('local');
    
//     res.send(data)
// });

// // app.post('/signin/authenticate',
// //   passport.authenticate('local'),
// //   function(req, res) {
// //     res.send(data)
// //   });

// // router.route('/authenticate/result').get((req, res) => {
// //     return isLoggedIn;
// // })



// async function authenticate(email, password, res) {
//     try{
//         console.log("Connect to database successfully!");
//         const table = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
//         console.log("table :" + table.rows);
//         if (table.rows != ""){ // if there is a match email
//             bcrypt.compare(password, table.rows[0].password)
//             .then(function(result) {
//                 const message = result ? "" : "Check your email and/or password!";
//                 //sess.userID = table.rows[0].id;
//                 setData(result, table.rows[0].id, message);
//             });
//         } else { // if there is no match email
//             setData(false, "", message);
//         }  
//     } catch (e){
//         console.log(e);
//     } finally {
//         console.log("Client disconnected successfully");
//     }
// }

// module.exports = router;

