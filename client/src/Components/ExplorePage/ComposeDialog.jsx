import React, {useState, useEffect, useRef} from 'react';
import Fab from '@material-ui/core/Fab';
import Photo from '@material-ui/icons/Photo';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';
import { orange, green, red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import InputRestaurantName from "./ComposeInputRestaurantName";
import { useSelector } from 'react-redux';
import ImageSlide from '../SharedComponents/ImageSlide'
import axios from 'axios';


const ComposeDialog = (props) => {
    const userName = useSelector(state => state.currentUser.name);
    const [restaurant, setRestaurant] = useState(null);
    
    const [checkButtonStatus, setCheckButtonStatus] = useState(false);

    const [blogContent, setBlogContent] = useState("");

    const [files, setFiles] = useState([]);

    const [sources, setSources] = useState([]);


    const handleChange = (event) => {
        
        
        var newSources = [];
        var newFiles = []
        for(let i = 0; i < event.target.files.length; i++){
            newFiles.push(event.target.files[i]);
        }
        
        console.log("files ", [...files, ...newFiles]);
        for(let i = 0; i < newFiles.length; i++){
            newSources.push(URL.createObjectURL(newFiles[i]))
        }
        console.log("sources ", [...sources, ...newSources]);
        
        setSources([...sources, ...newSources]);
        setFiles([...files, ...newFiles]);
    
    }

    useEffect(() => {
        if(props.focusBlog != undefined){
            setBlogContent(props.focusBlog.blogContent);
            setSources(props.focusBlog.images)
        }
    }, [props.focusBlog])

    useEffect(() => {
        if(props.open == false){
            setFiles([]);
        }
    }, [props.open])

    useEffect(() => {
        if(restaurant != null && blogContent != ""){
            setCheckButtonStatus(true);
        } else setCheckButtonStatus(false);
    }, [restaurant, blogContent])

    

    
    
    return(
        <div className="compose-dialog-container">
            <Dialog maxWidth="lg" fullWidth={true} className="compose-dialog" open={props.open}>
                <div className={"compose-dialog-content " +(sources.length == 0 ? "" : "row")}>
                    <div className={(sources.length == 0 ? "col-12" : "col-7 compose-area")}>
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
                            <input type="file"  accept="image/*" hidden id="selectImage" onChange={handleChange} multiple="multiple"/>
                            <Fab 
                                onClick={() => {
                                    props.handleClose();
                                    setFiles([]);
                                    setSources([]);
                                }} 
                                className="fab" 
                                aria-label="edit" 
                                style={{backgroundColor: red[100], margin: 20}}>
                                <Cancel className="compose-cancel-icon" />
                            </Fab>
                            {checkButtonStatus 
                            ? <Fab
                                onClick={() => {
                                    if(props.focusBlog.blogID === ''){
                                        console.log("Posting");
                                        props.handlePost(restaurant, blogContent, files, (result) => {
                                            if(result){
                                                setRestaurant(null);
                                                setBlogContent('');
                                            }
                                        });
                                    } else {
                                        console.log("Editing");
                                        props.handleEdit(restaurant, blogContent, files, (result) => {
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
                        sources.length != 0
                        ? <div className="col-5 preview-container">
                            <ImageSlide className="preview" images={sources} size="sm"/>
                          </div>
                        : null
                    }
                    
                </div>
                

            </Dialog>
        </div>
        
        
    );
}

export default ComposeDialog;
