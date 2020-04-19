import React from 'react';

import  '../../styles/RestaurantInfoDetail.css';
import {Carousel} from 'react-bootstrap';

function ImageSlide(props) {
    console.log(props.photos)
    return(
        <div>
            <h4 className="info-category-title">Photos</h4>
            <Carousel className="slide-images">
                {props.photos.map(({photo_reference}) => {
                    return (
                        <Carousel.Item className="carousel-item">
                            <img 
                            className="d-block w-100 carousel-img"
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`}
                            alt="First slide"
                            style={{width: '100vw', height: '75vh'}}
                            />
                        </Carousel.Item>
                    );
                })}
                
            </Carousel>
        </div>
        
    );
}



export default ImageSlide;