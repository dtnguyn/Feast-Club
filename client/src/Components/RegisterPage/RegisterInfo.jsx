import React, { useState } from "react";
import '../../styles/Register.css';
import SearchBar from "./SearchBar"
import FeaturesList from "./FeaturesList"
import Logo from "../SharedComponents/Logo"

function RegisterInfo(){
    return(
        <div className="register-info-box">
            <Logo/>
            <SearchBar/>
            <FeaturesList/>
        </div>
    );
}

export default RegisterInfo;
