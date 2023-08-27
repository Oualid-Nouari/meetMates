import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Post from './Post'
import PostModal from './PostModal'
import { Contexts } from '../contexts/contexts'

const ExplorePosts = () => {
    const { colors } = useContext(Contexts)
    const [posts, setPosts] = useState([])
    const [postOpened, setPostOpened] = useState(null)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [skip, setSkip] = useState(0)
    const scrollRef = useRef(null)
    const handleIntersecting = (entries => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMoreData) {
            fetchMore()
        }
    })
    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersecting)
        if (observer && scrollRef.current) {
            observer.observe(scrollRef.current)
        }
        return () => {
            if(observer) {
                observer.disconnect()
            }
        }
    }, [posts])
    const fetchMore = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/explorePosts?skip=${skip*5}&limit=5`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => {
            const newPosts = Response.data.posts;
            if (newPosts.length === 0) {
                setHasMoreData(false)
            } else {
                setPosts([...posts, ...newPosts])
                setSkip(prevSkip => prevSkip + 1)
            }            
        })
    }
    return (
        <div className='posts'>
            <div className='posts-container'>
                {postOpened && <div className='post-overlay' onClick={() => setPostOpened(false)}>
                </div>}
                {postOpened && <PostModal post={postOpened} setPostOpened={setPostOpened} />}
                {posts.map((post, index) => {
                    return (
                        <div key={index}> <Post post={post} setPostOpened={setPostOpened} /> </div>
                    )
                })}
            </div>
            {hasMoreData ?
                <div className='lazy-loading' ref={scrollRef} style={{backgroundColor: colors.fourthColor}}>
                </div> : <div></div>
            }
        </div>
    )
}

export default ExplorePosts
