import React, { useState } from "react";

import HomePage from "./Components/HomePage/HomePage"
import RegisterPage from "./Components/RegisterPage/RegisterPage"
import SignInPage from "./Components/SignInPage/SignInPage"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import './styles/App.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App(props) {


  return (
    <Router>
      <Route path="/" exact component={HomePage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/signin" component={SignInPage} />
    </Router>
  );
}

export default App;