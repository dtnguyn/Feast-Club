import React, {useState, useEffect} from 'react';

import InfoNavbar from '../SharedComponents/InfoNavbar'
import { updateCurrentLocation } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'

import '../../styles/Explore.css'

function ExplorePage(){
    const [cityImage, setCityImage] = useState("");

    const global_location = useSelector(state => state.userLocation);
    console.log("City: " + global_location.lat);

    function getCityImage(city){
        const url = `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${city}&image_type=photo&orientation=horizontal&min_width=1000`
        axios.get("http://localhost:5000/cityImage", {
            params: {
                city: city
            }
        })
            .then((response) => {
                if (response.data.hits.length === 0) {
                    setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
                } else {
                    const randomIndex = Math.floor((Math.random() * response.data.hits.length));
                    console.log(response.data.hits);
                    console.log(randomIndex);
                    setCityImage(response.data.hits[randomIndex].largeImageURL);
                }
            })
            .catch(err => {
                console.log(err);
                setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
            })
    }

    useEffect(() => {
        
        getCityImage(global_location.city)}, [global_location]
    );
    return <div className="explore-page">
        <InfoNavbar/>
        <img className="city-img" src={cityImage}/>
        <h2 className="explore-title">See what other people eat in <br/> {global_location.city} city</h2>
    </div>
}

export default ExplorePage;