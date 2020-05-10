import React, { useState } from "react";

import '../../styles/Map.css'

function InfoBoxLine(props){
    return(
        <div>
            <p className="info-name">{props.name}</p>
            <p className="info-box-content">{props.content}</p>
        </div>
    );
    
}

export default InfoBoxLine;