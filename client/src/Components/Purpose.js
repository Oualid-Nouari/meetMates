import React from 'react'
import Goal from '../imgs/Your netwok.jpg'

const Purpose = ({setOpenHomeModal, openHomeModal}) => {
    return (
        <article className={openHomeModal ? 'goal-article opened' : 'goal-article'}>
            <i class="fa-solid fa-xmark" onClick={() => setOpenHomeModal(false)}></i>
            <img src={Goal} alt="Goal" />
            <div className='purpose-text'>
                <h1>What is meetMates ? &#129300;</h1>
                <p><small>N</small>etworking is an indispensable aspect of personal and professional growth, offering numerous benefits that can propel individuals forward in their respective fields. The significance of networking lies in its ability to connect individuals with like-minded peers who possess similar skills and ambitions. By engaging with others who share the same interests, individuals can tap into a wealth of knowledge, expertise, and experiences that can greatly enhance their own skill set.</p>
                <p>Networking also provides a platform for personal development. Engaging with individuals who have achieved success in their respective fields can serve as a source of inspiration and motivation. Mentors and role models within a network can offer guidance, share valuable insights, and provide advice on navigating career challenges. Moreover, networking allows individuals to enhance their interpersonal skills, such as communication, negotiation, and leadership, which are essential in building successful relationships and advancing professionally.</p>
                <p><small>O</small>ur platform, meetMates, is designed to facilitate the process of networking and connecting with individuals who share similar skills and professional interests. By joining meetMates, users gain access to a vibrant community of like-minded individuals who are eager to expand their networks and foster meaningful connections.</p>
            </div>
        </article>
    )
}

export default Purpose
