import React from 'react';

import  '../../styles/RestaurantInfoDetail.css';
import {Navbar} from 'react-bootstrap';
import InfoBox from '../Map/InfoBox';
import Logo from '../SharedComponents/LogoSmall'

function InfoNavbar(){
    return(
        <Navbar className="info-navbar">
            <Navbar.Brand className="info-navbar-logo">
                <Logo/>
            </Navbar.Brand>
        </Navbar>
    );
}

export default InfoNavbar;