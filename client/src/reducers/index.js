import updateUserLocation from './updateUserLocation';
import loggedReducer from './loggedReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    userLocation : updateUserLocation,
    isLoggedIn : loggedReducer
})

export default allReducers