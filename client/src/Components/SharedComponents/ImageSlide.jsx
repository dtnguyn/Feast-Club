import React from 'react';
import "../../styles/Shared.css";
import { render } from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.css"; 
import { Carousel } from 'react-responsive-carousel';
// import {Carousel} from 'react-bootstrap';


const ImageSlide = ({images, size}) => {
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

        // <Carousel>
        //     {images.map((image, i) => {
        //             return(
        //                 <Carousel.Item key={i}>
        //                     <img alt="" src={image} />
        //                 </Carousel.Item>
        //             );
        //         })}
        // </Carousel>

        
    )
}

export default ImageSlide;