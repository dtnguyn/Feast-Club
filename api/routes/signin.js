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


router.route('/signinResult').post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    authenticate(email, password);
});

async function authenticate(email, password) {
    try{
        await client.connect();
        console.log("Connect to database successfully!");
        console.log(email);
        const table = await client.query("SELECT email, password FROM users WHERE email = $1", [email]);
        //const table = await client.query("SELECT email, password FROM users");
        bcrypt.compare(password, table.rows[0].password).then(function(result) {
            result ? console.log("Sign in successfully") : console.log("Your password: " + password + " is wrong!");
        });
    } catch (e){
        console.log(e);

    } finally {
        await client.end();
        console.log("Client disconnected successfully");
    }
}

module.exports = router;

