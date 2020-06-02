import React, {useState, useEffect, useReducer} from 'react';

import InfoNavbar from '../SharedComponents/InfoNavbar'
import { useSelector } from "react-redux";
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import NavigationIcon from '@material-ui/icons/Navigation';
import { orange} from '@material-ui/core/colors';
import ComposeDialog from "./ComposeDialog"
import BlogPost from "./BlogPost"
import LinearProgress from '@material-ui/core/LinearProgress';
import ConfirmDialog from "../SharedComponents/ConfirmDialog";
import SearchBar from "../SharedComponents/SearchBar";
import UpdateLocationForm from "../SharedComponents/UpdateLocationForm"
import { search as SearchBlogs} from "../../Utilities/makeCancelRequest"


import '../../styles/Explore.css'



function ExplorePage(){
    const [cityImage, setCityImage] = useState("");

    const [openCompose, setOpenCompose] = useState(false);

    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(false);

    const global_location = useSelector(state => state.userLocation);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [focusBlog, setFocusBlog] = useState({
        blogID: '',
        restaurant: '',
        blogContent: '',
        images: []
    })

    const [openLocationForm, setOpenLocationForm] = useState(false);

    const composeIconStyle = {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
        backgroundColor: orange[100]
    };

    const changeLocationIconStyle = {
        marginTop: '20px',
        backgroundColor: orange[100]
    };
    console.log("City: " + global_location.lat);

    const resetFocusBlog = () => {
        setFocusBlog({
            blogID: '',
            restaurant: '',
            blogContent: '',
            images:[]
        })
    }

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

    const postBlog = (restaurant, blogContent, files, callback) => {
        var formData = new FormData();
        for (const key of Object.keys(files)) {
            formData.append('imgCollection', files[key])
        }

        axios.post("http://localhost:5000/blogPosts", formData ,  {
            headers: {
              'accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            },
            withCredentials: true,
            params: {
                restaurantID: restaurant.id,
                restaurantName: restaurant.name,
                restaurantAddress: restaurant.address,
                city: restaurant.city,
                country: restaurant.country,
                blogContent
            }

        })
            .then((response) => {
                if(response.data){
                    getBlogs();
                    callback(true);
                    setOpenCompose(false)
                }
            })
            .catch(err => {
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
                    resetFocusBlog();
                    getBlogs();
                }
                    
            })
    }


    const editBlog = (restaurant, blogContent, files, callback) => {
        
        var formData = new FormData();
        for (const key of Object.keys(files)) {
            formData.append('imgCollection', files[key])
        }  

        axios.patch("http://localhost:5000/blogPosts", formData,{
            withCredentials: true,
            params: {
                blogID: focusBlog.blogID,
                restaurantID: restaurant.id,
                restaurantName: restaurant.name,
                restaurantAddress: restaurant.address,
                city: restaurant.city,
                country: restaurant.country,
                blogContent
            }
        })
            .then(response => {
                if(response.data){
                    console.log("Successfully edit a blogpost!");
                    resetFocusBlog();
                    getBlogs();
                    setOpenCompose(false);
                    callback(true);
                }
                    
            })
    }

    const searchBlogs = (value) => {
        setLoading(true);
        axios.get("http://localhost:5000/blogPosts/search", {
            withCredentials: true,
            params: {
                textInput: value,
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

    


    useEffect(() => {
        getCityImage(global_location.city)}, [global_location]
    );

    useEffect(() => {
        getBlogs();
    }, [global_location])
    return <div>
        <InfoNavbar/>
        {loading ? <LinearProgress color="secondary" /> : null}
        <div className="explore-page">
            <img className="city-img" src={cityImage}/>
            <h2 className="explore-title">See what other people eat in <br/> {global_location.city}</h2>
            <SearchBar 
                onChange={(value) => {
                    search = async (value) => {
                        searchBlogs(value)
                    }
                }} 
                placeholder="Search posts..."

            />
            <Fab onClick={() => setOpenLocationForm(true)} variant="extended" size="md"  style={changeLocationIconStyle}>
                <NavigationIcon className="change-location-icon"/>
                Change Location 
            </Fab>
            {blogs.map(blog => {
                return <BlogPost
                    blog={blog}
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
                    comments={blog.comments ? blog.comments : 0}
                    requestDeleteBlog={() => {
                        setFocusBlog({...focusBlog, blogID: blog.id});
                        setDeleteDialog(true);
                    }}
                    triggerEditDialog={() => {
                        setFocusBlog({
                            blogID: blog.id,
                            restaurant: blog.restaurant_name.concat(", ", blog.restaurant_address),
                            blogContent: blog.content,
                            images: blog.images == null ? [] : blog.images
                        });
                        setOpenCompose(true);
                    }}
                />
            })}
            
            <Fab onClick={() => setOpenCompose(true)} className="fab" style={composeIconStyle}  aria-label="edit">
                <EditIcon className="compose-icon" />
            </Fab>
            <ComposeDialog 
                open={openCompose} 
                handleClose={() => {
                    setOpenCompose(false);
                    resetFocusBlog();
                }} 
                focusBlog={focusBlog}
                handlePost={postBlog}
                handleEdit={editBlog}
            />
            <ConfirmDialog 
                open={deleteDialog} 
                close={() => setDeleteDialog(false)} 
                message="Do you want to delete this post?"
                confirmedAction={() => deleteBlog(focusBlog.blogID)}
            />
        </div>
        {openLocationForm && <UpdateLocationForm
            open={openLocationForm}
            close={() => setOpenLocationForm(false)}
            getNearbyRestaurants={getBlogs}
          />}
    </div>
}

export default ExplorePage;