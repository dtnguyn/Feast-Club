import React, { useState } from "react";
import '../../styles/Map.css';



function SearchBar(){
    return(
        <input className="input-searchBar-window-info" type="text" name="search" placeholder="Search for restaurants.."/    >
    );
}

export default SearchBar;