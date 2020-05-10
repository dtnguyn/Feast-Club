import React, { useState } from "react";


import InfoBoxLine from "./InfoBoxLine";
import axios from "axios"
import '../../styles/Map.css'

function InfoBox(props){
    function getDetail() {
      props.startLoading();
      axios.get("http://localhost:5000/findrestaurantID", {
        withCredentials: true,
        params: {
          textInput: props.restaurantName + " " + props.address,
          lat: props.lat,
          lng: props.lng
        }
      })
      .then((response) => {
        console.log(response.data.geometry.location.lat, response.data.geometry.location.lng)
        const info = {
          id: response.data.place_id,
          latLng: {
            lat: response.data.geometry.location.lat,
            lng: response.data.geometry.location.lng
          }
        }
        props.findSpecificRestaurant(info)
      })
      .catch(err => {
          console.log(err);
      })

      
    }
    return(
        <div onClick={getDetail} className="info-box">
          <h4 className="info-box-title">{props.restaurantName}</h4>
          <p className="info-box-title">{props.priceLevel}</p>
          {props.address != "" &&  props.address != undefined ?  <InfoBoxLine name="Address" content={props.address}/> : null}
          {props.cuisine != "" && props.cuisine != undefined  ? <InfoBoxLine name="Cuisine" content={props.cuisine}/> : null}
          {props.rating != "" && props.rating != undefined  ? <InfoBoxLine name="Rating" content={props.rating}/> : null}
        </div>
    );
    
}

export default InfoBox;