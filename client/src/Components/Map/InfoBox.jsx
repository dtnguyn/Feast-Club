import React, { useState } from "react";


import InfoBoxLine from "./InfoBoxLine"
import '../../styles/Map.css'

function InfoBox(props){
    return(
        <div className="info-box">
          <h4>{props.restaurantName}</h4>
          <p className="info-box-content">{props.description}</p>
          <InfoBoxLine name="Address" content={props.address}/>
          <InfoBoxLine name="Cuisine" content={props.address}/>
          <InfoBoxLine name="Rating" content={props.rating}/>
        </div>
    );
    
}

export default InfoBox;