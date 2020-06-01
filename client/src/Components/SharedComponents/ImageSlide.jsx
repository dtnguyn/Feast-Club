import React from 'react';
import "../../styles/Shared.css";
import { render } from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';



const ImageSlide = ({images, size}) => {
    return (
        <div  className={(size == "sm" ? "image-slide-sm" : "image-slide-lg")}>
            <Carousel showArrows={false} dynamicHeight={true} showStatus={false} >
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