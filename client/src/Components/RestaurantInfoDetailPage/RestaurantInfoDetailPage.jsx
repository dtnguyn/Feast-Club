import React, {useState} from 'react';
import  '../../styles/RestaurantInfoDetail.css';
import {Carousel, Navbar} from 'react-bootstrap';

import ImageSlide from './ImageSlide';
import InfoNavbar from './InfoNavbar'

function RestaurantInfoDetailPage(){
    return(
        <div className="restaurant-info-detail-page">
            <InfoNavbar/>
            <ImageSlide/>
        </div>
    );
}

export default RestaurantInfoDetailPage;