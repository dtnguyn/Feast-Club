// require('dotenv').config();
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = require('express').Router();

const { uuid } = require('uuidv4');

//To hast password before save in database
const bcrypt = require('bcrypt');
const saltRounds = 10;

const {Client} = require('pg')
const client = new Client({
    user: "postgres",
    password: "0914ad0914",
    host: "localhost",
    port: 5432,
    database: "feast_club_db"
})

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:5000/auth/google/feast_club",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     findOrCreateUser(accessToken, refreshToken, profile, cb);
//   }
// ));


router.route('/').get((req, res) => {
    console.log("register")
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err,hash){
        if(!err){
            addUser(name, email, hash);
        } else {
            console.log(err);
        }
    })
});

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// });

async function addUser(name, email, password) {
    try{
        await client.connect();
        console.log("Connect to database successfully!")
        const table = await client.query("INSERT INTO users VALUES ($1, $2, $3, $4)", [uuid(), name, email, password]);
        console.table(table.rows)
    } catch (e){
        console.log(e);

    } finally {
        await client.end();
        console.log("Client disconnected successfully");
    }
}

// async function findOrCreateUser(accessToken, refreshToken, profile, cb){
//     try{
//         await client.connect();
//         console.log("Connect to database successfully!")
//         const table = await client.query("SELECT email FROM users WHERE id = $1", [profile.id]);
//         console.log(table.rows);
//     } catch (e){
//         console.log(e);

//     } finally {
//         await client.end();
//         console.log("Client disconnected successfully");
//     }
// }


module.exports = router;