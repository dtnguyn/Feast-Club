import React, { useState } from "react";

import HomePage from "./Components/HomePage/HomePage"
import RegisterPage from "./Components/RegisterPage/RegisterPage"
import SignInPage from "./Components/SignInPage/SignInPage"
import MainPage from "./Components/MainPage/MainPage"
import RegisterStatusPage from "./Components/RegisterPage/RegisterStatusPage";  

import './styles/App.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link , useHistory} from "react-router-dom";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { Hidden } from "@material-ui/core";


function App(props) {

  //const history = useHistory();
  

  return (
    <Router style={{overflow: Hidden}}>
      <Route path="/" exact component={HomePage} />
      <Route path="/register" exact component={RegisterPage} />
      <Route path="/register/status" component={RegisterStatusPage}/>
      <Route path="/signin" component={SignInPage} />
      <Route path="/mainPage" component={MainPage}/>
      
    </Router>
  );
}

export default App;
