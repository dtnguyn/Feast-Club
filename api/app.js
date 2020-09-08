require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');


const port = 5000;
const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    preflightContinue: false,
    credentials: true
}));

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


const {auth} = require("./routes/auth");
const restaurants = require("./routes/restaurants");
const blogs = require("./routes/blogs")
const user = require("./routes/user")

app.use("/restaurants", restaurants);
app.use("/blogs", blogs)
app.use("/auth", auth);
app.use("/user", user)



app.listen(port, () => console.log(`Feast Club is running on port ${port}!`));