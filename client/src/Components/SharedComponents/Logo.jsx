import React, { useState } from "react";
import '../../styles/Logo.css';

function Logo(props) {
  if(props.size == "sm") {
    return (
      <div>
        <h1 className="logo-first-letter-small">Feast</h1>
        <h2 className="logo-second-letter-small"> club</h2>
      </div>
    )
  } else if(props.size == "md") {
    return (
      <div>
        <h1 className="logo-first-letter-medium">Feast</h1>
        <h2 className="logo-second-letter-medium"> club</h2>
      </div>
    )
  } else {
    return (
      <div>
          <h1 className="logo-first-letter-big">Feast</h1>
          <h2 className="logo-second-letter-big"> club</h2>
      </div>
    );
  }
  
}

export default Logo;