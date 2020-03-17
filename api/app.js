const express = require('express');
const cors = require('cors');
const port = 5000;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.use(express.json());

const registerRouter = require('./routes/register');
const signinRouter = require('./routes/signin');

app.use('/register', registerRouter);
app.use('/signin', signinRouter);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));