import React, {useState, useEffect} from 'react';

import InfoNavbar from '../SharedComponents/InfoNavbar'
import { updateCurrentLocation } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { orange} from '@material-ui/core/colors';
import ComposeDialog from "./ComposeDialog"


import '../../styles/Explore.css'

function ExplorePage(){
    const [cityImage, setCityImage] = useState("");

    const [openCompose, setOpenCompose] = useState(false)
    const global_location = useSelector(state => state.userLocation);

    const style = {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
        backgroundColor: orange[100]
    };
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
    return <div>
        <InfoNavbar/>
        <div className="explore-page">
            <img className="city-img" src={cityImage}/>
            <h2 className="explore-title">See what other people eat in <br/> {global_location.city} city</h2>
            <Fab onClick={() => setOpenCompose(true)} className="fab" style={style}  aria-label="edit">
                <EditIcon className="compose-icon" />
            </Fab>
            <ComposeDialog open={openCompose} handleClose={() => setOpenCompose(false)} />
        </div>
        
    </div>
}

export default ExplorePage;