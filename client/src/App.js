import React, { useState } from "react";


import RegisterPage from "./Components/RegisterPage/RegisterPage"
import SignInPage from "./Components/SignInPage/SignInPage"
import MainPage from "./Components/MainPage/MainPage"
import RegisterStatusPage from "./Components/RegisterPage/RegisterStatusPage";  
import RestaurantInfoDetailPage from "./Components/RestaurantInfoDetailPage/RestaurantInfoDetailPage";
import ExplorePage from "./Components/ExplorePage/ExplorePage"
import BlogDetailPage from "./Components/BlogDetailPage/BlogDetailPage"
import UserInfoPage from "./Components/UserInfoPage/UserInfoPage"

import './styles/App.css';


import { BrowserRouter as Router, Route} from "react-router-dom";

import { Hidden } from "@material-ui/core";




function App(props) {
  return (
    <Router 
      style={{overflow: Hidden}}
    >
      <Route path="/" exact component={MainPage} />
      <Route path="/register" exact component={RegisterPage} />
      <Route path="/register/status" component={RegisterStatusPage}/>
      <Route path="/signin" component={SignInPage} />
      <Route path="/info" component={RestaurantInfoDetailPage}/>
      <Route path="/explore" component={ExplorePage}/>
      <Route path="/bloginfo" component={BlogDetailPage}/>
      <Route path="/userinfo" component={UserInfoPage}/>
    </Router>
  );
}

export default App;
