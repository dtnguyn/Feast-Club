import React, { useState } from "react";
import '../../styles/Map.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import AlertDialog from '../SharedComponents/AlertDialog'
import restaurants from "../../restaurants";
import { useHistory } from "react-router-dom";
import testRestaurant from "../../foundRestaurant"
import axios from "axios";

function SearchBar(props){

    const [invalidSearch, setInvalidSearch] = useState(false);
    const [foundRestaurant, setFoundRestaurant] = useState({
        data: []
    })
    const history = useHistory();

    const searchOptions={
        location: new window.google.maps.LatLng(props.lat, props.lng),
        radius: 10000
    }
    // const searchOptions = {
    //     location: new google.maps.LatLng(-34, 151),
    //     radius: 2000,
    //     types: ['address']
    //   }

    const [address,setAddress] = useState("");

    async function handleSelect(value){
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        console.log(latLng);
        console.log(results);
        checkRestaurant(results[0], latLng);
        setAddress(value);
    }

    function handleChange(value){
        setAddress(value);
    }

    function handleClose(){
        setInvalidSearch(false);
    }
    
    function checkRestaurant(restaurant, latLng){
        if(!restaurant.types.includes('restaurant')){
            setInvalidSearch(true)
        } else {
            const info = {
                id : restaurant.place_id,
                latLng: latLng
            }
            findSpecificRestaurant(info);
        }
    }

    function findSpecificRestaurant(info){
        axios.post("http://localhost:5000/findrestaurant", info, {withCredentials: true})
        .then((response) => {
            console.log("Found it!!!");
            const result = response.data.result;
            console.log(response.data);
            
            if(result != undefined){
                setFoundRestaurant(testRestaurant);
                console.log("Restaurant is valid");
                history.push("/info");
            } else {
                console.log("Restaurant is valid");
                setInvalidSearch(true);
            }
        })
        .catch(err => {
            console.log(err);
        })
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
            {invalidSearch 
            ? <AlertDialog
                open={invalidSearch}
                close={handleClose}
                alertTitle="Cannot find Restaurants!"
                alertMessage="Sorry! We are unable to find the restaurants that you requested. Please try again!"
                
              />
            : null}
        </div>
        
        

    );
}

export default SearchBar;