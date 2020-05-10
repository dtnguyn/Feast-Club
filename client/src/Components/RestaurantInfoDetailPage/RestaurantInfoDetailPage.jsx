import React, {useState} from 'react';
import  '../../styles/RestaurantInfoDetail.css';
import {Carousel, Navbar} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import axios from 'axios'

import ImageSlide from './ImageSlide';
import InfoNavbar from '../SharedComponents/InfoNavbar'
import MapDirection from './MapDirection'
import ReviewCard from './ReviewCard'


function RestaurantInfoDetailPage(props){   
    const restaurant = props.location.state.restaurant;
    const origin = props.location.state.origin;
    const destination = props.location.state.destination;

    

    function calculatePriceLevels(priceLevel){
        switch(priceLevel){
            case 1:
                return <img src="./price_level_icon.svg" style={{width: 30, height: 30}}></img>
            case 2:
                return (
                <div>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30}}></img>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                </div>
                );
            case 3: 
                return (
                    <div>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30}}></img>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30}}></img>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                        <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                    </div>
                );
            default: 
            return (
                <div>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30}}></img>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                    <img src="./price_level_icon.svg" style={{width: 30, height: 30, marginLeft: 10}}></img>
                </div>
            );
        }
    }

    return(
        <div className="restaurant-info-detail-page">
            <InfoNavbar/>
            <h1 className="restaurant-name">{restaurant.name}</h1>
            {restaurant.opening_hours.open_now 
                ? <img className="restaurant-status-icon" src="/open_icon.svg"/> 
                : <img className="restaurant-status-icon" src="/close_icon.svg"/>}
            
            <div className="row">
                <div className="col-md-4 col-sm-12 info-category">
                    <h4 className="info-category-title">Price & Rating</h4>
                    <p>Price</p>
                    {calculatePriceLevels(restaurant.price_level)}
                    <p>Rating</p>
                    <StarRatings
                        rating={restaurant.rating}
                        starRatedColor="orange"
                        numberOfStars={5}
                        name='rating'
                        starDimension="30px"
                        starSpacing="5px"
                    />
                </div>
                <div className="col-md-4 col-sm-12 info-category">
                    <h4 className="info-category-title">Openning Hours</h4>
                    {restaurant.opening_hours.weekday_text.map(day => {
                        return <p>{day}</p>
                    })}
                </div>
                <div className="col-md-4 col-sm-12 info-category">
                    <h4 className="info-category-title">Contact info</h4>
                    <p>Phone Number</p>
                    <p id="phone-number">
                        <img src="./telephone_icon.svg" style={{width: 25, height: 25, marginRight: 10}}/>
                        {restaurant.formatted_phone_number}
                    </p>
                    <p>Website</p>
                    <p><a href={restaurant.website}>{restaurant.website}</a></p>
                    
                </div>
            </div>
            <ImageSlide photos={restaurant.photos}/>
            <div className="info-category">
                <h4 className="info-category-title">Direction</h4>
                <div className="row">
                    <div className="col-md-3 col-sm-12">
                        <p>Address</p>
                        <p id="address">{restaurant.formatted_address}</p>
                    </div>
                    <div className="col-md-9 col-sm-12">
                        <MapDirection
                            origin={origin}
                            destination={destination}
                        />
                    </div>
                </div>
            </div>
            
            <div className="info-category">
                <h4 className="info-category-title">Reviews from Google</h4>
                {restaurant.reviews.map(review => {
                    return(
                        <ReviewCard 
                            author={review.author_name}
                            rating={review.rating}
                            img={review.profile_photo_url}
                            content={review.text}
                        />
                    );
                    
                })}
                
            </div>
        </div>
    );
}

export default RestaurantInfoDetailPage;