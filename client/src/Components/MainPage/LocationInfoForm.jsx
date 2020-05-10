import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Geocode from "react-geocode";

//import cities from "all-the-cities";
import axios from 'axios';

export default function LocationInfoForm(props) {

  Geocode.setApiKey("");

  const [open, setOpen] = React.useState(true);
  const [address,setAddress] = useState("");
  const [saveActive, setSaveActive] = useState(false);
  const [userLocationInfo, setUserLocationInfo] = useState({
    lat: null,
    lng: null,
    city: "",
    state: "",
    country: ""
  })

  const searchOptions = {
    types: ['(cities)']
  }
  

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    const addressComponents = results[0].address_components;
    extractLocationInfo(addressComponents, latLng);
    
    setAddress(value);
    setSaveActive(true);
  }

  function extractLocationInfo(addressComponents, latLng){
    var locationInfo = {
      lat: null,
      lng: null,
      city: "",
      state: "",
      country: ""
    }
    locationInfo.lat = latLng.lat;
    locationInfo.lng = latLng.lng;
    addressComponents.forEach(component => {
      if(component.types.includes('locality')) 
      locationInfo.city = component.long_name;
      else if(component.types.includes('administrative_area_level_1') 
              && component.long_name != locationInfo.city){
        if(locationInfo.city === "") locationInfo.city = component.long_name;
        else locationInfo.state = component.long_name;
      }
      else if(component.types.includes('country'))
      locationInfo.country = component.long_name;
    })
    setUserLocationInfo(locationInfo);
    setSaveActive(true);
  }

  function handleChange(value){
    setAddress(value);
    setSaveActive(false);
  }

  function handleSaveButton(){
    axios.post("http://localhost:5000/savelocation", userLocationInfo, {withCredentials: true})
        .then(response => {
          console.log("then")
          if(response.data){
            setOpen(false);
            window.location.reload();
          } else {
            alert("Fail to save your location! Try again!");
          }
        })
        .catch(err => {
          console.log(err);
        })
  }

  function getUserCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        Geocode.fromLatLng(latLng.lat, latLng.lng).then(
          response => {
            const addressComponents = response.results[0].address_components;
            console.log(addressComponents);
            extractLocationInfo(addressComponents, latLng);
          },
          error => {
            console.error(error);
          }
        );
      })
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><span style={{fontWeight: 'bold'}}>LOCATION ACCESS</span></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{fontWeight: 'bold'}}>In order to for Feast Club to work properly, we need your location information!</span>
          </DialogContentText>
          <Button variant="contained" color="secondary" onClick={getUserCurrentLocation}>
            Allow Feast Club to get your current location
          </Button>
          <hr/>
          <DialogContentText>
            <span style={{fontWeight: 'bold'}}>Or...just provide us the city you are in</span>
          </DialogContentText>
          <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect} searchOptions={searchOptions}>
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
              <div>
                <TextField
                  {...getInputProps()}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Enter your city..."
                  type="text"
                  fullWidth
                ></TextField>
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
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <span style={{color: '#eb8242', fontWeight: 'bold'}}>Cancel</span>
          </Button>
          {saveActive 
            ? <Button onClick={handleSaveButton} color="primary">
                <span style={{color: '#eb8242', fontWeight: 'bold'}}>Save</span>
              </Button> 
            : <Button onClick={handleClose} color="default" disabled>
                <span>Save</span>
              </Button>}
          
        </DialogActions>
      </Dialog>
    </div>
  );
}