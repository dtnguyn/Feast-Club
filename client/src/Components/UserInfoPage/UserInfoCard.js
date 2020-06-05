import React, {useState} from "react";
import "../../styles/UserInfoPage.css"
import { useSelector } from "react-redux"

const UserInfoCard = (props) => {

    const [avatar, setAvatar] = useState(useSelector(state => state.currentUser.avatar));

    

    const handleChange = (event) => {
        if(event.target.files[0] === null) return;
        props.startLoading()
        setAvatar(URL.createObjectURL(event.target.files[0]));
        props.imageAction(event.target.files[0]);
    }

    return(
        <div className="user-info-card-container">
            <div className="user-info-card">
                <img 
                    className="avatar-image avatar-image-lg avatar-image-hover" 
                    src={avatar}
                    onClick={() => document.getElementById("selectImage").click()}
                />
                <input type="file"  accept="image/*" hidden id="selectImage" onChange={handleChange}/>
                <div className="user-info-card-text-container">
                    <p className="user-info-card-text user-name-info">
                        Adron Nguyen 
                        <img src="/edit-username-icon.svg" className="small-button press-button" id="edit-user-icon"/>
                    </p>
                    <p className="user-info-card-text">0 Posts </p>
                    <a className="user-info-card-text link" href="#" >Log out</a>
                </div>
            </div>
        </div>
        
    )
}

export default UserInfoCard