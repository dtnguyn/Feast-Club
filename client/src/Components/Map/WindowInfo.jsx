import React, { useState } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBContainer,
  MDBHamburgerToggler } from 'mdbreact';
import '../../styles/Map.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./WindowInfoSearchBar"
import InfoBox from "./InfoBox"


function WindowInfo(props){

  const [open, setOpen] = useState(false);

    return(
      <div>
        <FontAwesomeIcon className="window-info-icon" icon={faGlobeAsia}/>
        <FontAwesomeIcon className="window-info-icon" icon={faUser}/>
        <FontAwesomeIcon id="compass" className="window-info-icon" icon={faCompass}/>
        <SearchBar/>
        <p className="window-info-title">Check out {props.restaurantsCount} restaurants near you!</p>
        {props.restaurants.data.map((restaurant) => (
          <InfoBox 
          restaurantName={restaurant.name}
          priceLevel={restaurant.price_level}
          address={restaurant.address} 
          cuisine={restaurant.cuisine != undefined && restaurant.cuisine[0] != undefined
                  ? restaurant.cuisine.map(type => {

                    return type.name + (restaurant.cuisine.indexOf(type) != restaurant.cuisine.length - 1 ? ", " : "");
                  })
                  : ""} 
          rating={restaurant.rating}/>
        ))}
        
      </div>

    );
    
}

export default WindowInfo