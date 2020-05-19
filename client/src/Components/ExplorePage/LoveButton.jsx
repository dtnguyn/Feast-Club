import React from 'react';
import "../../styles/Explore.css"

const LoveButton = (props) => {
    return(
        <div>
            {
            props.buttonStatus 
                ?  <img onClick={props.handleClick} className="love-icon" src="love_icon.svg" />
                : <img onClick={props.handleClick} className="love-icon" src="not_love_icon.svg" />
            }
            
        </div>
    );

}

export default LoveButton