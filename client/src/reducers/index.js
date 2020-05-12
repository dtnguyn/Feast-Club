import updateUserLocation from './updateUserLocation';
import loggedReducer from './loggedReducer';
import currentUserReducer from './currentUserReducer'
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    userLocation : updateUserLocation,
    isLoggedIn : loggedReducer,
    currentUser : currentUserReducer
})

export default allReducers