import React, {useState, useEffect, useReducer} from 'react';
import { useHistory } from 'react-router-dom'
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


import '../../styles/Explore.css'



function ExplorePage(){
    const [cityImage, setCityImage] = useState("");

    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(false);

    const global_location = useSelector(state => state.userLocation);

    
    const [openCompose, setOpenCompose] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [focusBlog, setFocusBlog] = useState({
        blogID: '',
        restaurant: '',
        blogContent: '',
        images: []
    })

    const [openLocationForm, setOpenLocationForm] = useState(false);

    const history = useHistory();
    const isLoggedIn = useSelector(state => state.isLoggedIn)
  
    const checkAuthentication = () => {
        if(!isLoggedIn){
            history.push("/signin");
            return false
        }
    }

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
        axios.get("http://localhost:5000/blogs/cityImage", {
            params: {
                city: city
            }
        })
            .then((response) => {
                setLoading(false);
                const apiResponse = response.data
                console.log("image response: " + apiResponse.data)
                if (!apiResponse.status || apiResponse.data.hits.length === 0) {
                    setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
                } else {
                    const randomIndex = Math.floor((Math.random() * apiResponse.data.hits.length));
                    setCityImage(apiResponse.data.hits[randomIndex].largeImageURL);
                }
            })
            .catch(err => {
                alert(err)
                setCityImage("https://bgfons.com/uploads/city/city_texture6440.jpg");
                setLoading(false);
            })
    }

    const getBlogs = () => {
        setLoading(true);
        axios.get("http://localhost:5000/blogs/", {
            withCredentials: true,
            params: {
                city: global_location.city,
                country: global_location.country,
            }
        })
            .then((response) => {
                const apiResponse = response.data
                console.log("response: " +  response.data);
                if(apiResponse.status){
                    setBlogs(apiResponse.data);
                } else {
                    alert(apiResponse.message);
                }
                
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

        axios.post("http://localhost:5000/blogs/", formData ,  {
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
                const apiResponse = response.data
                if(apiResponse.status){
                    getBlogs();
                    callback(true);
                    setOpenCompose(false)
                    resetFocusBlog();
                } else if(apiResponse.code = 401) {
                    history.push("/signin");
                } else {
                    alert(apiResponse.message)
                }
            })
            .catch(err => {
                alert(err)
                console.log(err);
            })

    }

    const deleteBlog = (blogID) => {
        axios.delete("http://localhost:5000/blogs", {
                withCredentials: true,
                params: { 
                    blogID
                } 
            })
            .then(response => {
                const apiResponse = response.data
                if(apiResponse.status){
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

        axios.patch("http://localhost:5000/blogs/", formData,{
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
                const apiResponse = response.data
                if(apiResponse.status){
                    console.log("Successfully edit a blogpost!");
                    resetFocusBlog();
                    getBlogs();
                    setOpenCompose(false);
                    callback(true);
                }
                    
            })
    }


    const createCancelToken = () => axios.CancelToken.source()
    let cancelToken = null
    const searchBlogs = (value) => {
        setLoading(true);

        if(cancelToken) {
            console.log("cancel");
            cancelToken.cancel();
        } 
        cancelToken = createCancelToken();
        axios.get("http://localhost:5000/blogs/search", {
            withCredentials: true,
            cancelToken: cancelToken.token,
            params: {
                textInput: value,
                city: global_location.city,
                country: global_location.country,
            }
        })
            .then((response) => {
                const apiResponse = response.data
                setLoading(false)
                if(apiResponse.status){
                    setBlogs(apiResponse.data);
                } else {
                    alert(apiResponse.message)
                }
                
                
            }) 
            .catch((err) => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err);
                } else {
                   
                    console.log(err);    
                }
               
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
                    
                    searchBlogs(value);
                }} 
                placeholder="Search posts..."

            />
            <Fab onClick={() => setOpenLocationForm(true)} variant="extended" size="md"  style={changeLocationIconStyle}>
                <NavigationIcon className="change-location-icon"/>
                Change Location 
            </Fab>
            {blogs.map((blog, i) => {
                return <BlogPost
                    key={i}
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
                        if(!isLoggedIn){
                            history.push("/signin");
                            return
                        }
                        setFocusBlog({...focusBlog, blogID: blog.id});
                        setDeleteDialog(true);
                    }}
                    triggerEditDialog={() => {
                        if(!isLoggedIn){
                            history.push("/signin");
                            return
                        }
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
            
            <Fab onClick={() => {
                if(!isLoggedIn){
                    history.push("/signin");
                    return
                }
                setOpenCompose(true);
            }}
                 className="fab" style={composeIconStyle}  aria-label="edit">
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