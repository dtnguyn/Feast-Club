import React, { useState } from "react";


import InfoBoxLine from "./InfoBoxLine"
import '../../styles/Map.css'

function InfoBox(props){
    return(
        <div className="info-box">
          <h4 className="info-box-title">{props.restaurantName}</h4>
          <p className="info-box-title">{props.priceLevel}</p>
          {props.address != "" &&  props.address != undefined ?  <InfoBoxLine name="Address" content={props.address}/> : null}
          {props.cuisine != "" && props.cuisine != undefined  ? <InfoBoxLine name="Cuisine" content={props.cuisine}/> : null}
          {props.rating != "" && props.rating != undefined  ? <InfoBoxLine name="Rating" content={props.rating}/> : null}
        </div>
    );
    
}

export default InfoBox;