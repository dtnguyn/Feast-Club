import React, {useState, useEffect, useReducer} from 'react';

import InfoNavbar from '../SharedComponents/InfoNavbar'
import { updateCurrentLocation } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { orange} from '@material-ui/core/colors';
import ComposeDialog from "./ComposeDialog"
import BlogPost from "./BlogPost"
import LinearProgress from '@material-ui/core/LinearProgress';
import ConfirmDialog from "../SharedComponents/ConfirmDialog"

import '../../styles/Explore.css'



function ExplorePage(){
    const [cityImage, setCityImage] = useState("");

    const [openCompose, setOpenCompose] = useState(false);

    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(false);

    const global_location = useSelector(state => state.userLocation);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [focusBlog, setFocusBlog] = useState('')

    const style = {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
        backgroundColor: orange[100]
    };
    console.log("City: " + global_location.lat);


    function getCityImage(city){
        setLoading(true);
        const url = `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${city}&image_type=photo&orientation=horizontal&min_width=1000`
        axios.get("http://localhost:5000/cityImage", {
            params: {
                city: city
            }
        })
            .then((response) => {
                if (response.data.hits.length === 0) {
                    setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
                } else {
                    const randomIndex = Math.floor((Math.random() * response.data.hits.length));
                    console.log(response.data.hits);
                    console.log(randomIndex);
                    setCityImage(response.data.hits[randomIndex].largeImageURL);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
                setLoading(false);
            })
    }

    const getBlogs = () => {
        console.log("hererere");
        setLoading(true);
        axios.get("http://localhost:5000/blogPosts", {
            withCredentials: true,
            params: {
                city: global_location.city,
                country: global_location.country,
            }
        })
            .then((response) => {
                console.log("response: " +  response.data);
                setBlogs(response.data);
                setLoading(false)
            }) 
            .catch((err) => {
                alert(err);
                console.log(err);
            })
    }

    const deleteBlog = (blogID) => {
        axios.delete("http://localhost:5000/blogPosts", {
            withCredentials: true,
            params: { 
                blogID
            } 
        })
            .then(response => {
                if(response.data){
                    console.log("Successfully delete a blogpost!");
                    setFocusBlog('')
                    getBlogs();
                }
                    
            })
    }


    useEffect(() => {
        getCityImage(global_location.city)}, [global_location]
    );

    useEffect(() => {
        getBlogs();
    }, [])
    return <div>
        <InfoNavbar/>
        {loading ? <LinearProgress color="secondary" /> : null}
        <div className="explore-page">
            
            <img className="city-img" src={cityImage}/>
            <h2 className="explore-title">See what other people eat in <br/> {global_location.city} city</h2>
            {blogs.map(blog => {
                return <BlogPost
                    blogID={blog.id}
                    userID={blog.user_id}
                    avatar={blog.user_ava}
                    authorName={blog.author_name}
                    date={blog.date}
                    restaurantName={blog.restaurant_name}
                    address={blog.restaurant_address}
                    content={blog.content}
                    hearts={blog.hearts ? blog.hearts : 0}
                    isHearted={blog.is_hearted == 1}
                    requestDeleteBlog={() => {
                        setFocusBlog(blog.id)
                        setDeleteDialog(true)
                    }}
                />
            })}
            
            <Fab onClick={() => setOpenCompose(true)} className="fab" style={style}  aria-label="edit">
                <EditIcon className="compose-icon" />
            </Fab>
            <ComposeDialog open={openCompose} handleClose={() => setOpenCompose(false)} updateBlogs={() => getBlogs()}/>
            <ConfirmDialog 
                open={deleteDialog} 
                close={() => setDeleteDialog(false)} 
                message="Do you want to delete this post?"
                confirmedAction={() => deleteBlog(focusBlog)}
            />
        </div>
        
    </div>
}

export default ExplorePage;