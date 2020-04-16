import {  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import React, { useState } from "react";

import LocationInfoForm from './LocationInfoForm'
import axios from "axios";
import Loader from 'react-loader-spinner';

import testRestaurants from "../../restaurants"
import mapStyles from "../../mapStyles";
import WindowInfo from "./WindowInfo"
import "../../styles/Map.css"
import LinearProgress from '@material-ui/core/LinearProgress';


function Map(){
    const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + process.env.REACT_APP_GOOGLE_API_KEY;
    const [restaurants, setRestaurants] = useState({
        data: []
    })

    const [latLng, setLatLng] = useState({
        lat: 0,
        lng: 0
    });

    const [loading, setLoading] = useState(false)
    
    const [requestFlag, setRequestFlag] = useState(false);

    function getNearbyRestaurants(latLng){
        setLoading(true);
        axios.post("http://localhost:5000/nearbyrestaurants", latLng, {withCredentials: true})
        .then((response) => {
            console.log(response.data);
            setRestaurants(testRestaurants);
            setLatLng(latLng);
            setLoading(false);
            console.log("finish loading!");
        })
        .catch(err => {
            console.log(err);
        })
    }

    function MapSetUp(){
        
        const [selectedRestaurant, setSelectedRestaurant] = useState(null);
        const [loading, setLoading] = useState(true)
    
        const defaultMapOptions = {
            fullscreenControl: false,
            disableDefaultUI: true,
            disableAutoPan: true,
            styles: mapStyles
        };
    
        if(latLng.lat === 0 && latLng.lng === 0 && !requestFlag){
            setRequestFlag(true);
            navigator.geolocation.getCurrentPosition(function(position){
                const latLng = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                getNearbyRestaurants(latLng);
            });
        }
        return (
            <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: 0, lng: 0}}
            defaultOptions={defaultMapOptions}
            center={{lat: parseFloat(latLng.lat), lng: parseFloat(latLng.lng)}}>
                {latLng.lat != 0 && latLng.lng != 0 
                    ? <Marker
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
                    : null}
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
            {loading ? <LinearProgress color="secondary" />
            : <WrappedMap
                googleMapURL={mapUrl}
                loadingElement={<div style={{height: "100%"}}/>}
                containerElement={<div style={{height: "100%"}}/>}
                mapElement={<div style={{height: "100%"}}/>}
            />}
            </div>
            
            <div className="window-info col-md-3">
                <WindowInfo 
                    restaurantsCount={restaurants.data.length}
                    restaurants={restaurants}
                    getNearbyRestaurants={getNearbyRestaurants}
                    lat={latLng.lat}
                    lng={latLng.lng}
                />
            </div>
        </div>
        
    )
}

export default Map;