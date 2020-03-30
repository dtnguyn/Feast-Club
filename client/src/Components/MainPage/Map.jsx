
import {  GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";
import React, { useState } from "react";

function MapSetUp(){
    return (<GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 10.762622, lng: 106.660172}}
    />);
}

const WrappedMap = withScriptjs(withGoogleMap(MapSetUp))

function Map(){
    
    return(
        <div style={{width: '100vw', height: '100vh'}}>
            <WrappedMap
                googleMapURL=
                {'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key='}
                loadingElement={<div style={{height: "100%"}}/>}
                containerElement={<div style={{height: "100%"}}/>}
                mapElement={<div style={{height: "100%"}}/>}
            />
        </div>
    )
}

export default Map;