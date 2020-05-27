import React, {useState, useEffect, useRef} from 'react';
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
    const [restaurant, setRestaurant] = useState(null);
    
    const [checkButtonStatus, setCheckButtonStatus] = useState(false);

    const [blogContent, setBlogContent] = useState("");

    const [files, setFiles] = useState([]);

    const [source, setSource] = useState("")

    const inputFileRef = useRef(null);

    const handleChange = (event) => {
        console.log(event.target.files[0]);
        setFiles(event.target.files);
        setSource(URL.createObjectURL(event.target.files[0]));
    }

    useEffect(() => {
        setBlogContent(props.focusBlog.blogContent);
    }, [props.focusBlog])

    useEffect(() => {
        if(restaurant != null && blogContent != ""){
            setCheckButtonStatus(true);
        } else setCheckButtonStatus(false);
    }, [restaurant, blogContent])

    useEffect(() => {
        setFiles([]);
    }, [])

    
    
    return(
        <Dialog maxWidth="lg" fullWidth={true} className="compose-dialog" open={props.open}>
            <div className={"compose-dialog-content " +(files.length == 0 ? "" : "row")}>
                <div className={(files.length == 0 ? "col-12" : "col-6")}>
                    <div className="compose-header">
                        <img src="/default-user-icon.svg" style={{width: "60px", height: "60px"}} />
                        <p className="compose-author">{userName}</p>
                    </div>
                    <div className="compose-body">
                        <InputRestaurantName setRestaurant={setRestaurant}/>
                        <label className="compose-label">Your experience</label>
                        <textarea 
                            className="form-control" 
                            rows="10" placeholder="Tell us your story..." 
                            value={blogContent} 
                            onChange={(event) => setBlogContent(event.target.value)}
                        />
                    </div>
                    <div className="compose-action-button">
                        <Fab onClick={() => document.getElementById("selectImage").click()}
                            className="fab" 
                            aria-label="edit" 
                            style={{backgroundColor: orange[100], margin: 20}}>
                            <Photo className="compose-photo-icon" />
                        </Fab>
                        <input type="file" autocomplete="off" accept="image/*" hidden id="selectImage" onChange={handleChange} />
                        <Fab onClick={() => props.handleClose()} className="fab" aria-label="edit" style={{backgroundColor: red[100], margin: 20}}>
                            <Cancel className="compose-cancel-icon" />
                        </Fab>
                        {checkButtonStatus 
                        ? <Fab
                            onClick={() => {
                                if(props.focusBlog.blogID === ''){
                                    console.log("Posting");
                                    props.handlePost(restaurant, blogContent, (result) => {
                                        if(result){
                                            setRestaurant(null);
                                            setBlogContent('');
                                        }
                                    });
                                } else {
                                    console.log("Editing");
                                    props.handleEdit(restaurant, blogContent, (result) => {
                                        if(result){
                                            setRestaurant(null);
                                            setBlogContent('');
                                        }
                                    })
                                }
                            }} 
                            className="fab" 
                            aria-label="edit" 
                            style={{backgroundColor: green[100], margin: 20}}>
                            <Check className="compose-check-icon" />
                        </Fab>
                        : <Fab disabled style={{margin: 20}}>
                            <Check className="compose-check-icon" />
                        </Fab>
                        }
                    </div>
                </div>
                {
                    files.length != 0
                    ? <div className="col-6 preview-container">
                        <img id="previewImage" className="preview" src={source}/>
                     </div>
                    : null
                }
                
            </div>
            

        </Dialog>
        
    );
}

export default ComposeDialog;
