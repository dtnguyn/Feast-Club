import React, { useState } from "react";
import '../../styles/Register.css';
import SearchBar from "../SharedComponents/SearchBar"
import FeaturesList from "./FeaturesList"
import Logo from "../SharedComponents/Logo"

function RegisterInfo(){
    return(
        <div className="register-info-box">
            <Logo/>
            <SearchBar placeholder="Search for restaurants..."/>
            <FeaturesList/>
        </div>
    );
}

export default RegisterInfo;
