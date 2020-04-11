import {  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import React, { useState } from "react";

import LocationInfoForm from './LocationInfoForm'
import axios from "axios";
import Loader from 'react-loader-spinner';

import testRestaurants from "../../restaurants"
import mapStyles from "../../mapStyles";
import WindowInfo from "./WindowInfo"
import "../../styles/Map.css"

import { useGlobal,setGlobal } from 'reactn';







function Map(){

    const [restaurants, setRestaurants] = useState({
        data: []
    })

    const [latLng, setLatLng] = useState({
        lat: 0,
        lng: 0
    });
    
    const [requestFlag, setRequestFlag] = useState(false)
    function MapSetUp(){
        
        const [selectedRestaurant, setSelectedRestaurant] = useState(null);
        const [loading, setLoading] = useState(true)
    
        const defaultMapOptions = {
            fullscreenControl: false,
            disableDefaultUI: true,
            styles: mapStyles
        };
    
        var count = 0
        if(latLng.lat === 0 && latLng.lng === 0 && !requestFlag){
            setRequestFlag(true);
            axios.get("http://localhost:5000/nearbyrestaurants", {withCredentials: true})
                .then((response) => {
                    if(response.data.location != null){
                        console.log(response.data);
                        
                        setLoading(false)
                        setLatLng(response.data.location);
                        setRestaurants(response.data.restaurants)
                        
                    } else setLoading(false)
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
                {latLng.lat === 0 && latLng.lng === 0 && !loading
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
                            url: '/restaurant-icon.png',
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
                        options={{disableAutoPan: false}}
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
                    restaurantsCount={restaurants.data.length}
                    restaurants={restaurants}
                />
            </div>
        </div>
        
    )
}

export default Map;