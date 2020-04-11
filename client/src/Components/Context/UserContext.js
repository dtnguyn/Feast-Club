import { createContext } from 'react';

export const RestaurantContext = createContext({});

// export const RestaurantProvider = props => {
//     const [restaurants, setRestaurants] = useState({
//         data: [],
//         open_hours_options:{},
//         paging:{}
//     })

//     const [latLng, setLatLng] = useState({
//         lat: 0,
//         lng: 0
//     });

//     const [loading, setLoading] = useState(true)

//     if(latLng.lat === 0 && latLng.lng === 0){
//         axios.get("http://localhost:5000/nearbyrestaurants", {withCredentials: true})
//             .then((response) => {
//                 if(response.data.location != null){
//                     console.log(response.data);
//                     setLoading(false)
//                     setLatLng(response.data.location);
//                     setRestaurants(testRestaurants)
                    
//                 } else setLoading(false)
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     return (
//         <RestaurantContext.Provider value={[restaurants, setRestaurants]}>
//             {props.children}
//         </RestaurantContext.Provider>
//     )
// }