import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import allReducers from './reducers/index';
import { Provider } from 'react-redux';
import store from "./configureStore";

//Fonts
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import './fonts/DancingScript-Bold.ttf'
import './fonts/DancingScript-Medium.ttf'
import './fonts/DancingScript-Regular.ttf'
import './fonts/DancingScript-SemiBold.ttf'
import './fonts/BalooBhai-Regular.ttf'
import './fonts/Montserrat-Light.ttf'


require('dotenv').config()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

