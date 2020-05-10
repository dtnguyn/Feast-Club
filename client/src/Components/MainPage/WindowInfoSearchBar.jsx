import React, { useState } from "react";
import '../../styles/Map.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import { useSelector } from "react-redux"

function SearchBar(props){
    const global_location = useSelector(state => state.userLocation);

    const searchOptions={
        location: new window.google.maps.LatLng(global_location.latLng.lat, global_location.latLng.lng),
        radius: 10000
    }
    const [address,setAddress] = useState("");

    

    async function handleSelect(value){
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);


        checkRestaurant(results[0], latLng);
        setAddress(value);
    }

    function handleChange(value){
        setAddress(value);
    }
    
    function checkRestaurant(restaurant, latLng){
        if(!restaurant.types.includes('restaurant')){
            props.setInvalidSearch(true)
        } else {
            const info = {
                id : restaurant.place_id,
                latLng: latLng
            }
            props.findSpecificRestaurant(info);
        }
    }

    return(
        <div>
            <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect} searchOptions={searchOptions}>
                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                <div>
                    <input 
                    {...getInputProps()}
                    className="input-searchBar-window-info"
                    type="text" 
                    name="search" 
                    placeholder="Search for restaurants.."/>
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

export default SearchBar;