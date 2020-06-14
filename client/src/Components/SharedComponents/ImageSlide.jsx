import React from 'react';
import "../../styles/Shared.css";
import { render } from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.css"; 
import { Carousel } from 'react-responsive-carousel';
// import {Carousel} from 'react-bootstrap';


const ImageSlide = ({images, size}) => {
    console.log("Images: " + images)
    if(images.length === 0) return null;
    
    return (
        <div  className={(size == "sm" ? "image-slide-sm" : "image-slide-lg")}>
            <Carousel  dynamicHeight={true} showStatus={false} >
                {images.map((image, i) => {
                    return(
                        <div key={i}>
                            <img alt="" src={image} />
                        </div>
                    );
                })}
            </Carousel>
        </div>
    )
}

export default ImageSlide;