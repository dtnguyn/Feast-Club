import React, { useState } from "react";
import { Tabs } from 'antd';
import BlogPost from "../ExplorePage/BlogPost"
import 'antd/dist/antd.css';

const TabView = (props) => {

    const { TabPane } = Tabs;


    return (
        <Tabs defaultActiveKey="1">
            <TabPane
                tab={
                    <span>
                    <img className="love-icon-tab" src="blog-icon.svg" />
                    Your blogs
                    </span>
                }
                key="1"
                >
                    {
                        props.blogs.userBlogs.map((blog,i) => {
                            return(
                                <BlogPost
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
                                        props.setFocusBlog({...props.focusBlog, blogID: blog.id});
                                        props.setDeleteDialog(true);
                                    }}
                                    triggerEditDialog={() => {
                                        props.setFocusBlog({
                                            blogID: blog.id,
                                            restaurant: blog.restaurant_name.concat(", ", blog.restaurant_address),
                                            blogContent: blog.content,
                                            images: blog.images == null ? [] : blog.images
                                        });
                                        props.setOpenCompose(true);
                                    }}
                                />
                            )
                            
                        })
                    }
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <img className="love-icon-tab" src="love_icon.svg" />
                        Liked
                    </span>
                }
                key="2"
                >
                    {
                        props.blogs.likedBlogs.map((blog,i) => {
                            return(
                                <BlogPost
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
                                        props.setFocusBlog({...props.focusBlog, blogID: blog.id});
                                        props.setDeleteDialog(true);
                                    }}
                                    triggerEditDialog={() => {
                                        props.setFocusBlog({
                                            blogID: blog.id,
                                            restaurant: blog.restaurant_name.concat(", ", blog.restaurant_address),
                                            blogContent: blog.content,
                                            images: blog.images == null ? [] : blog.images
                                        });
                                        props.setOpenCompose(true);
                                    }}
                                />
                            )
                            
                        })
                    }
            </TabPane>
        </Tabs>
    );
}

export default TabView;