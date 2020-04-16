import React from 'react';

import  '../../styles/RestaurantInfoDetail.css';
import {Carousel} from 'react-bootstrap';

function ImageSlide() {
    return(
        <Carousel className="slide-images">
            <Carousel.Item className="carousel-item">
                <img 
                className="d-block w-100 carousel-img"
                src="https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/tinh/king-bbq-phan-xixh-long-hcm/king-bbq-phan-xich-long-18.jpg"
                alt="First slide"
                style={{width: '100vw', height: '75vh'}}
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://images.foody.vn/res/g30/297936/prof/s576x330/foody-mobile-t1-jpg-512-636156824315218739.jpg"
                alt="Third slide"
                style={{width: '100vw', height: '75vh'}}
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/tinh/king-bbq-phan-xixh-long-hcm/king-bbq-phan-xich-long-2.jpg"
                alt="Third slide"
                style={{width: '100vw', height: '75vh'}}
                />
            </Carousel.Item>
            </Carousel>
    );
}



export default ImageSlide;