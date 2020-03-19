const express = require('express');
const router = require('express').Router();
const httpProxy = require('http-proxy');
//const proxy = httpProxy.createProxyServer(options); 

const { uuid } = require('uuidv4');

const app = express();


//To hast password before save in database
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE
});


var isLoggedIn = false


router.route('/authenticate').post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    authenticate(email, password, res);
});

router.route('/authenticate/result').get((req, res) => {
    return isLoggedIn;
})

function sendDataBack(logIn, id, message, res){
    const dataSendBack = {
        logInStatus: logIn,
        id: id,
        message: message
    }
    res.send(dataSendBack);
}

async function authenticate(email, password, res) {
    try{
        console.log("Connect to database successfully!");
        const table = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
        console.log("table :" + table.rows);

        if (table.rows != ""){ // if there is a match email
            bcrypt.compare(password, table.rows[0].password)
            .then(function(result) {
                const message = result ? "" : "Check your email and/or password!";
                sendDataBack(result, table.rows[0].id, message, res);
            });
        } else { // if there is no match email
            sendDataBack(false, "", "Check your email and/or password!", res);
        }  
    } catch (e){
        console.log(e);
    } finally {
        console.log("logged in:" + isLoggedIn)
        console.log("Client disconnected successfully");
    }
}

module.exports = router;

