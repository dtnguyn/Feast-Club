import React from 'react';
import "../../styles/Shared.css";
import { render } from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';



const ImageSlide = ({images}) => {
    return (
        <div  className="image-container">
            <Carousel dynamicHeight={true} showStatus={false} >
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