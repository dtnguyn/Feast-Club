import React, {useState} from 'react';
import Fab from '@material-ui/core/Fab';
import Photo from '@material-ui/icons/Photo';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';
import { orange, green, red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import InputRestaurantName from "./ComposeInputRestaurantName";
import { useSelector } from 'react-redux';
import axios from 'axios';

const ComposeDialog = (props) => {
    const userName = useSelector(state => state.currentUser.name);
    const [restaurant, setRestaurant] = useState(null)
    const [blogContent, setBlogContent] = useState("");

    const handlePost = () => {
        axios.post("http://localhost:5000/blogPosts", {restaurant, blogContent}, {withCredentials: true})
            .then((response) => {
                if(response.data){
                    props.updateBlogs();
                    setRestaurant(null);
                    setBlogContent('');
                    props.handleClose();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return(
        <Dialog maxWidth="lg" fullWidth={true} className="compose-dialog" open={props.open}>
            <div className="compose-header">
                <img src="/default-user-icon.svg" style={{width: "60px", height: "60px"}} />
                <p className="compose-author">{userName}</p>
            </div>
            <div className="compose-body">
                <InputRestaurantName setRestaurant={setRestaurant}/>
                <label className="compose-label">Your experience</label>
                <textarea 
                    class="form-control" 
                    rows="10" placeholder="Tell us your story..." 
                    value={blogContent} 
                    onChange={(event) => setBlogContent(event.target.value)}
                />
            </div>
            <div className="compose-action-button">
                <Fab className="fab" aria-label="edit" style={{backgroundColor: orange[100], margin: 20}}>
                    <Photo className="compose-photo-icon" />
                </Fab>
                <Fab onClick={() => props.handleClose()} className="fab" aria-label="edit" style={{backgroundColor: red[100], margin: 20}}>
                    <Cancel className="compose-cancel-icon" />
                </Fab>
                <Fab onClick={() => handlePost()} className="fab" aria-label="edit" style={{backgroundColor: green[100], margin: 20}}>
                    <Check className="compose-check-icon" />
                </Fab>
            </div>
        </Dialog>
    );
}

export default ComposeDialog;
