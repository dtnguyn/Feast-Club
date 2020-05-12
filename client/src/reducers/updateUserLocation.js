

const updateUserLocation =  (state = {
  latLng: {
    lat: null,
    lng: null
  },
  city: "",
  country: ""
}, action) => {
  switch(action.type){
    case "UPDATE_LOCATION":
      if(action.payload != undefined){
        return action.payload;
      } else {
        return state
      }
    default:
      return state
  }
  
}

export default updateUserLocation;