import React, { useEffect, useState } from 'react'
import NoPost from '../imgs/NO POST TO SEE.png'
import Post from './Post'
import axios from 'axios'
import Loading from './Loading'
import PostModal from './PostModal'

const PostsInProfile = ({ author }) => {
    const [PostsArray, setPostsArray] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [postOpened, setPostOpened] = useState(null) // contains opened post to add & read comments
    useEffect(() => {
        setIsLoading(true)
        axios.get(`${process.env.REACT_APP_API_URL}/posts?author=${author.id}`)
            .then((Response) => {
                setPostsArray(Response.data.authorPosts.reverse())
                setIsLoading(false)
            })
            .catch(err => console.log(err));
    }, [])
    return (
        <div className='posts'>
            {!isLoading ?
                <div className='posts-container'>
                    {postOpened && <div className='overlay' onClick={() => setPostOpened(false)}>
                    </div>}
                    {postOpened &&<PostModal post={postOpened} setPostOpened={setPostOpened} /> }
                    {PostsArray && PostsArray.length > 0 ? PostsArray.map((post, index) => {
                        return <Post post={post} setPostOpened={setPostOpened} key={index} />
                    }) : <img className='no-post' src={NoPost} alt="No post to see" />}
                </div> : <Loading />
            }
        </div>
    )
}

export default PostsInProfile
