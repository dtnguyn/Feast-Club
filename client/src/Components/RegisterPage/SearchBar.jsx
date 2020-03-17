import React, { useState } from "react";
import '../../styles/Register.css';



function SearchBar(){
    return(
        <input className="input-searchBar" type="text" name="search" placeholder="Search for restaurants.."/    >
    );
}

export default SearchBar;