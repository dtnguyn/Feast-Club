const express = require("express");
const router = express.Router();
const cors = require('cors');
const unirest = require("unirest");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');


//Passport config
router.use(cookieParser(process.env.SESSION_SECRET))

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());


router.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    preflightContinue: false,
    credentials: true
}));

const apiResponse = (code, message, status, data) => {
    return({
        code,
        message,
        status,
        data
    })
}

const nearbyrestaurants = require('../nearbyRestaurants');



// function getNearbyRestaurantsByGoogle(lat, lng, response){
//     console.log(lat, lng);
//     var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ lat + "," + lng + "&radius=1500&type=restaurant&key=" + process.env.GOOGLE_API_KEY;

//     superagent.get(url).end((err, res) => {
//         if (err) 
//             return console.log(err); 
//         else {
//             const latLng = {
//                 lat: lat,
//                 lng: lng
//             }
//             //console.log(res.body);
//             console.log(util.inspect(res.body, {showHidden: false, depth: null}));
//             response.send({
//                 location: latLng,
//                 restaurants: res.body
//             });
//         }
        
        
//     });
// }


function getNearbyRestaurantsByTripsAdvisor(lat,lng, callback){
    // var req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng");

    // req.query({
    //     "limit": "30",
    //     "currency": "USD",
    //     "distance": "2",
    //     "lunit": "km",
    //     "lang": "en_US",
    //     "latitude": lat,
    //     "longitude": lng
    // });
    
    // req.headers({
    //     "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
    //     "x-rapidapi-key": process.env.TRIP_ADVISOR_API_KEY
    // });
    
    
    // req.end(function (res) {
    //     if (res.error) throw new Error(res.error);
    //     callback(res.body);
    // });
     
    callback(nearbyrestaurants);
    
}

function getSpecificRestaurant(id, callback){
    const input = "205 Phan Xich Long Ward 2, Phu Nhuan Dist., Ho Chi Minh City Vietnam"

    const req = unirest("GET", "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + id + "&fields=name,rating,formatted_phone_number,icon,photo,formatted_address,opening_hours,website,price_level,rating,review,user_ratings_total&key=" + process.env.GOOGLE_API_KEY);


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        callback(res.body);

    });
    
    //findOrInsertRestaurantsInDatabase("ChIJ_3lMQdAodTERNMFuONVSmWw", testRestaurant);
    //callback(testRestaurant);   
}

function getRestaurantID(textInput, lat, lng, callback){
    const req = unirest("GET", `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${textInput}&inputtype=textquery&fields=place_id,name,geometry&locationbias=circle:1000@${lat},${lng}&key=AIzaSyAEX7J8GBc__Ope0D6V1Ot8N7z-x1R0IPo`);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        callback(res.body.candidates[0])
    });
}





router.get('/find/nearby', function(req, res){
    console.log("Finding nearby restaurants")
    console.log(req.query);
    getNearbyRestaurantsByTripsAdvisor(req.query.lat, req.query.lng, (restaurants) => {
        if(restaurants != null && restaurants != undefined){
            res.send(apiResponse(200, "Getting nearby restaurants successfully.", true, restaurants))
            console.log("Getting nearby restaurants successfully")
        } else {
            res.send(apiResponse(500, "Cannot get nearby restaurants.", false, null))
            console.log("Cannot get nearby restaurants.")
        }
    });
});

router.get('/find/id', function(req, res){
    console.log("Finding restaurant id...")
    getRestaurantID(req.query.textInput, req.query.lat, req.query.lng, (id) => {
        if(id != null && id != undefined && id != ""){
            console.log("Getting restaurant id successfully")
            res.send(apiResponse(200, "Getting restaurant id successfully.", true, id))
        } else {
            console.log("Cannot get restaurant id.")
            res.send(apiResponse(200, "Cannot get restaurant id.", false, null))
        }
    })
})

router.get('/find', function(req, res){
    console.log("Finding restaurants.... ");
    getSpecificRestaurant(req.query.id, (restaurant) => {
        if(restaurant != null && restaurant != undefined){
            console.log("Getting restaurant successfully.");
            res.send(apiResponse(200, "Getting restaurant successfully.", true, restaurant))
        } else {
            console.log("Cannot get restaurant.");
            res.send(apiResponse(500, "Cannot get restaurant.", false, null))
        }
    })
});

module.exports = router;