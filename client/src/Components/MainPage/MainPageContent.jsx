import {  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import React, { useState, useEffect } from "react";
import axios from "axios";
import mapStyles from "../../mapStyles";
import WindowInfo from "./WindowInfo"
import "../../styles/Map.css"
import LinearProgress from '@material-ui/core/LinearProgress';
import { updateCurrentLocation } from "../../actions";
import { useSelector, useDispatch } from "react-redux"
import getCityAndCountry from "../../Utilities/getCityAndCountry";

function MainPageContent(){
    const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + process.env.REACT_APP_GOOGLE_API_KEY;
    const [restaurants, setRestaurants] = useState({
        data: []
    })

    const dispatch = useDispatch();
    const global_location = useSelector(state => state.userLocation);
    

    const [loading, setLoading] = useState(false)
    


    function getNearbyRestaurants(latLng){
        console.log("Check latLng: " + latLng.lat);
        console.log("Check latLng: " + latLng.lng);
        setLoading(true);
        axios.get("http://localhost:5000/restaurants/find/nearby", {
            withCredentials: true,
            params: {
                lat: latLng.lat,
                lng: latLng.lng
            }
        })
        .then((response) => {
            setLoading(false);
            console.log("Nearby restaurants: " + response.data);
            const apiResponse = response.data
            if(apiResponse.status){
                setRestaurants(apiResponse.data);
            } 
        })
        .catch(err => {
            console.log(err);
        })
    }


    if(navigator.geolocation && global_location.latLng.lat == null){
        navigator.geolocation.getCurrentPosition(function(position){
            getCityAndCountry(position.coords.latitude, position.coords.longitude,  (location) => {dispatch(updateCurrentLocation(location))});  
        });
    }

    useEffect(() => {
        if(global_location.latLng.lat != null){
            getNearbyRestaurants(global_location.latLng);
        }
        
    },[global_location]); 

    

    function MapSetUp(){
        
        const [selectedRestaurant, setSelectedRestaurant] = useState(null);

        const defaultMapOptions = {
            fullscreenControl: false,
            disableDefaultUI: true,
            disableAutoPan: true,
            styles: mapStyles
        };

        return (
            <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: 0, lng: 0}}
            defaultOptions={defaultMapOptions}
            center={{lat: parseFloat(global_location.latLng.lat), lng: parseFloat(global_location.latLng.lng)}}>
                {global_location.latLng.lat != undefined
                    ? <Marker
                        key={0}
                        position={{
                            lat: parseFloat(global_location.latLng.lat),
                            lng: parseFloat(global_location.latLng.lng)
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

    if(!restaurants){
        return null;
    }

    return(
        <div className="map-container row">
            <div clasName="col-lg-9 col-md-12" style={{width: '75.5vw', height: '100vh'}}>
            {loading ? <LinearProgress color="secondary" />
            : <WrappedMap
                googleMapURL={mapUrl}
                loadingElement={<div style={{height: "100%"}}/>}
                containerElement={<div style={{height: "100%"}}/>}
                mapElement={<div style={{height: "100%"}}/>}
            />}
            </div>
            
            <div className="window-info col-lg-3 col-md-12">
                <WindowInfo 
                    restaurants={restaurants}
                    getNearbyRestaurants={getNearbyRestaurants}
                    startLoading={() => setLoading(true)}
                    stopLoading={() => setLoading(false)}
                />
            </div>
        </div>
        
    )
}

export default MainPageContent;