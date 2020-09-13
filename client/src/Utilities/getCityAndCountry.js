import { updateCurrentLocation } from "../actions";
// import { useDispatch } from "react-redux"
import Geocode from "react-geocode";

export default async (lat, lng, updateLocation) => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
    const latLng = {
        lat,
        lng
    }
    Geocode.setLanguage("en");
    const cityCountry = [];
    Geocode.fromLatLng(latLng.lat, latLng.lng).then(
        response => {
            const resultArray = response.results[0].address_components  
            resultArray.forEach((component) => {
                if(component.types.includes("administrative_area_level_1")){
                    cityCountry.push(component.long_name);
                }

                if(component.types.includes("country")){
                    cityCountry.push(component.long_name);
                }
            })
            const location = {
                latLng: latLng,
                city: cityCountry[0],
                country: cityCountry[cityCountry.length - 1]
            };
            console.log("Hello: ", location);
            updateLocation(location);
        },
        error => {
            console.error(error);
        }
    );
}