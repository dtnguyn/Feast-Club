const router = require('express').Router();
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({});


router.route('/').get((req, res) => {
    console.log("mainPage");
    
});




module.exports = router;