require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = 5000;
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.use(express.json());



const registerRouter = require('./routes/register');
const signinRouter = require('./routes/signin');
const mainPageRouter = require('./routes/mainPage')

app.use('/register', registerRouter);
app.use('/signin', signinRouter);
app.use('/mainPage', mainPageRouter)


app.listen(port, () => console.log(`Example app listening on port ${port}!`));