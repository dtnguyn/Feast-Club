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
          description={restaurant.description}
          address={restaurant.address} 
          cuisine={restaurant.cuisine} 
          rating={restaurant.rating}/>
        ))}
        
      </div>

    );
    
}

export default WindowInfo