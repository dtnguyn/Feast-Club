import React, { useState } from "react";
import '../../styles/Register.css';



function SearchBar(props){
    return(
        <input 
            onChange={(event) => {
                props.onChange(event.target.value);
            }} 
            className="input-searchBar" 
            type="text" 
            name="search" 
            placeholder={props.placeholder}
        />
    );
}

export default SearchBar;