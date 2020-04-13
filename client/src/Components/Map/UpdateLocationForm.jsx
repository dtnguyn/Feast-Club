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

export default function UpdateLocationForm(props) {

  Geocode.setApiKey("AIzaSyAEX7J8GBc__Ope0D6V1Ot8N7z-x1R0IPo");

  const [open, setOpen] = React.useState(true);
  const [address,setAddress] = useState("");
  const [saveActive, setSaveActive] = useState(false);
  const [latLng, setLatLng] = useState({
    lat: 0,
    lng: 0
});

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setLatLng(latLng);
    //extractLocationInfo(addressComponents, latLng);
    
    setAddress(value);
    setSaveActive(true);
  }



  function handleChange(value){
    setAddress(value);
    setSaveActive(false);
  }

  function handleSaveButton(){
    console.log(latLng);
    props.handleClose();
    props.getNearbyRestaurants(latLng);
  }

  function getUserCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        const latitudeLongitude = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setLatLng(latitudeLongitude);
        props.handleClose();
        props.getNearbyRestaurants(latitudeLongitude);
      })
    }
  }

  return (
    <div>
      <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><span style={{fontWeight: 'bold'}}>Change Location</span></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{fontWeight: 'bold'}}>Change to your current location</span>
          </DialogContentText>
          <Button variant="contained" color="secondary" onClick={getUserCurrentLocation}>
            Change
          </Button>
          <hr/>
          <DialogContentText>
            <span style={{fontWeight: 'bold'}}>Or, change to other locations</span>
          </DialogContentText>
          <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
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
          <Button onClick={props.handleClose} color="primary">
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