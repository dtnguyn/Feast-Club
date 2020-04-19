import {  GoogleMap, withScriptjs, withGoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import React, { useState } from "react";

import axios from "axios";

import mapStyles from "../../mapStyles";
import "../../styles/Map.css"
import LinearProgress from '@material-ui/core/LinearProgress';


function MapDirection(props){
    const mapUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${props.origin}&destination=${props.destination}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

    const directionsService = new window.google.maps.DirectionsService();

    const [directions, setDirections] = useState(null);

    const directionOptions = {
        suppressMarkers: true
    }

    const defaultMapOptions = {
        fullscreenControl: false,
        disableDefaultUI: true,
        styles: mapStyles
    };

    directionsService.route(
        {
          origin: props.origin,
          destination: props.destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
          console.log(props.origin);
          console.log(props.destination);
          console.log("directions: " + directions);
        }
    );

    function MapSetUp(){
        

        return (
            <GoogleMap
                defaultZoom={20}
                center={{lat: parseFloat(props.origin.lat), lng: parseFloat(props.origin.lng)}}
                defaultOptions={defaultMapOptions}
            >
                <Marker
                    key={0}
                    position={{
                        lat: parseFloat(props.origin.lat),
                        lng: parseFloat(props.origin.lng)
                    }}
                    onClick={() =>  {
                        
                    }}
                    icon={{
                        url: '/thinking.svg',
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                />
                <Marker
                    key={0}
                    position={{
                        lat: parseFloat(props.destination.lat),
                        lng: parseFloat(props.destination.lng)
                    }}
                    onClick={() =>  {
                        
                    }}
                    icon={{
                        url: '/restaurant-icon.png',
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                />
                <DirectionsRenderer
                    directions={directions}
                    options={directionOptions}
                    
                />
                )}
            </GoogleMap>
         
        );
    }
    
    const WrappedMap = withScriptjs(withGoogleMap(MapSetUp))

    
    return(
        <div className="map-container row">
            <div clasName="map col-md-9 col-sm-12" style={{width: '100vw', height: '70vh'}}>
            <WrappedMap
                googleMapURL={mapUrl}
                loadingElement={<div style={{height: "100%"}}/>}
                containerElement={<div style={{height: "100%"}}/>}
                mapElement={<div style={{height: "100%"}}/>}
            />
            </div>
        </div>
        
    )
}

export default MapDirection;