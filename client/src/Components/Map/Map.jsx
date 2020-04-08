import {  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import React, { useState } from "react";

import LocationInfoForm from './LocationInfoForm'
import axios from "axios";

import testRestaurants from "../../restaurants"
import mapStyles from "../../mapStyles";
import WindowInfo from "./WindowInfo"
import "../../styles/Map.css"


function MapSetUp(){
    const [latLng, setLatLng] = useState({
        lat: 0,
        lng: 0
    });
    const [restaurants, setRestaurants] = useState({
        data: []
    })
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const defaultMapOptions = {
        fullscreenControl: false,
        disableDefaultUI: true,
        styles: mapStyles
    };

    if(latLng.lat === 0 && latLng.lng === 0){
        axios.get("http://localhost:5000/nearbyrestaurants", {withCredentials: true})
            .then((response) => {
                if(response.data.location != null){
                    console.log(response.data);
                    setLatLng(response.data.location);
                    setRestaurants(testRestaurants);
                } 
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 0, lng: 0}}
        defaultOptions={defaultMapOptions}
        center={{lat: parseFloat(latLng.lat), lng: parseFloat(latLng.lng)}}>
            {latLng.lat === 0 && latLng.lng === 0 
                ? <LocationInfoForm/> 
                : <Marker
                    key={0}
                    position={{
                        lat: parseFloat(latLng.lat),
                        lng: parseFloat(latLng.lng)
                    }}
                    onClick={() =>  {
                        
                    }}
                    icon={{
                        url: '/thinking.svg',
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    />
                }
            {restaurants.data.map(restaurant => (
                <Marker
                    key={restaurant.location_id}
                    position={{
                        lat: parseFloat(restaurant.latitude),
                        lng: parseFloat(restaurant.longitude)
                    }}
                    onClick={() =>  {
                        setSelectedRestaurant(restaurant)
                    }}
                    icon={{
                        url: '/restaurant_icon.svg',
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                />
            ))}
            
            {selectedRestaurant && (
                <InfoWindow
                    position={{
                        lat: parseFloat(selectedRestaurant.latitude),
                        lng: parseFloat(selectedRestaurant.longitude)
                    }}
                    onCloseClick={() => {
                        setSelectedRestaurant(null);
                    }}
                >
                    <div>
                        <h4>{selectedRestaurant.name}</h4>
                        <h6>{selectedRestaurant.description}</h6>
                        <h6>Address: {selectedRestaurant.address}</h6>
                        <h6>Raiting: {selectedRestaurant.rating}</h6>

                    </div>
                </InfoWindow>
            )}
        </GoogleMap> 
     
    );
}

const WrappedMap = withScriptjs(withGoogleMap(MapSetUp))

function Map(){
    
    return(
        <div className="map-container row">
            <div clasName="map col-md-9 col-sm-12" style={{width: '75.5vw', height: '100vh'}}>
            <WrappedMap
                googleMapURL=
                {'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key='}
                loadingElement={<div style={{height: "100%"}}/>}
                containerElement={<div style={{height: "100%"}}/>}
                mapElement={<div style={{height: "100%"}}/>}
            />
            </div>
            
            <div className="window-info col-md-3">
                <WindowInfo 
                    restaurantsCount={testRestaurants.data.length}
                    restaurants={testRestaurants}
                />
            </div>
        </div>
        
    )
}

export default Map;