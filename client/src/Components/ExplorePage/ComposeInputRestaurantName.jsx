import React, { useState } from "react";
import '../../styles/Explore.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import { useSelector } from "react-redux"


function InputRestaurantName(props){
    const global_location = useSelector(state => state.userLocation);

    const searchOptions={
        location: new window.google.maps.LatLng(global_location.latLng.lat, global_location.latLng.lng),
        radius: 10000
    }
    const [address,setAddress] = useState("");

    

    async function handleSelect(value){
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);


        if(checkRestaurant(results[0])){
            props.setRestaurant({
                id : results[0].place_id,
                latLng: latLng
            });
            setAddress(value);
        } else {
            setAddress("");
            alert("This is not a valid restaurant");
        }
        
    }

    function handleChange(value){
        setAddress(value);
    }
    
    function checkRestaurant(restaurant){
        if(!restaurant.types.includes('restaurant')){
            return false;
        } else {
            return true;
        }
    }

    return(
        <div>
            <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect} searchOptions={searchOptions}>
                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                <div class="form-group">
                    <label className="compose-label">Restaurant Name</label>
                    <input 
                    {...getInputProps()}
                    className="compose-input-restaurant-name form-control"
                    type="text" 
                    name="search" 
                    placeholder="Enter the restaurant..."/>
                    <div>
                    {suggestions.map(suggestion => {
                        const style ={
                            backgroundColor: suggestion.active ? '#f6da63': null
                        }

                        return <div {...getSuggestionItemProps(suggestion, {style})}>
                        {suggestion.description}
                        </div> 
                    })}
                    </div>
                </div>
                )}
            </PlacesAutocomplete>
            
        </div>
        
        

    );
}

export default InputRestaurantName;