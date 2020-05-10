

const updateUserLocation =  (state = {
  latLng: {
    lat: null,
    lng: null
  },
  city: "",
  country: ""
}, action) => {
  if(action.payload != undefined){
    return action.payload;
  } else {
    return state
  }
}

export default updateUserLocation;