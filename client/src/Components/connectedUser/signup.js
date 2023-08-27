import React, { useState } from 'react'
import Service from '../../imgs/signup-image.jpg'
import Axios from 'axios'
import Loading from '../Loading';

const Signup = ({ setAccountCreated }) => {
    // Sign up
    const [flipCard, setFlipCard] = useState(false);
    const [signupErr, setSignupErr] = useState(false)
    const [creatingAccount, setCreatingAccount] = useState(false)
    const [signupForm, setSignupForm] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    })
    const handleChange = (e) => {
        let { name, value } = e.target;
        setSignupForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }))
        setSignupErr(false)
    }
    const signup = (e) => {
        e.preventDefault();
        setCreatingAccount(true)
        Axios.post(`${process.env.REACT_APP_API_URL}/user`, signupForm).then((Response) => {
            if (Response.data.error) {
                setSignupErr(Response.data.error)
                setCreatingAccount(false)
            } else {
                setCreatingAccount(false)
                setFlipCard(false);
                setAccountCreated(true)
                setTimeout(() => {
                    setAccountCreated(false)
                }, 2000)
                emptyFields()
            }
        })
    }
    // Login:
    const [loginErr, setLoginErr] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    const handleLoginChange = (e) => {
        let { name, value } = e.target;
        setLoginForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }))
        setLoginErr(false)
    }
    const login = (e) => {
        e.preventDefault()
        Axios.post(`${process.env.REACT_APP_API_URL}/login`, loginForm).then((Response) => {
            if (Response.data.error) {
                setLoginErr(Response.data.error)
            } else {
                localStorage.setItem('token', Response.data.token)
                window.location.assign("/")
            }
        })
    }
    // Empty fields:
    const emptyFields = () => {
        setSignupForm({ fullName: '', username: '', email: '', password: '', })
        setLoginForm({ email: '', password: '' });
    }
    // SWITCH THE FORM:
    return (
        <main className='main-home'>
            <div className='card' style={{ transform: flipCard ? 'rotateY(0deg)' : 'rotateY(-180deg)' }}>
                <div className='front'>
                    <img src={Service} alt="Logo" className='sign-up-image' />
                    <form onSubmit={signup}>
                        {creatingAccount && <div className='loading'> <Loading /> </div>}
                        <h2>Sign up</h2>
                        <input type="text" placeholder='Name...' name="fullName" value={signupForm.fullName} onChange={handleChange} />
                        <input type="text" placeholder='Username...' name="username" value={signupForm.username} onChange={handleChange} />
                        <input type="email" placeholder='Email...' name="email" value={signupForm.email} onChange={handleChange} />
                        <input type="password" placeholder='Password(at least 8 characters long)...' name="password" value={signupForm.password} onChange={handleChange} />
                        {signupErr && <h2 className='error'>{signupErr}</h2>}
                        <button className='submit-form' style={{ opacity: creatingAccount ? .4 : 1, cursor: creatingAccount ? 'no-drop' : 'pointer' }}>Sign up</button>
                        <span>Already have an account ? <strong onClick={() => { setFlipCard(!flipCard); emptyFields(); setSignupErr(false) }}>Login</strong></span>
                    </form>
                </div>
                <div className='back'>
                    <img src={Service} alt="Logo" className='sign-up-image' />
                    <form onSubmit={login}>
                        {creatingAccount && <div className='loading'> <Loading /> </div>}
                        <h2>Login</h2>
                        <input type="email" placeholder='Email...' name="email" value={loginForm.email} onChange={handleLoginChange} />
                        <input type="password" placeholder='Password...' name="password" value={loginForm.password} onChange={handleLoginChange} />
                        {loginErr && <h2 className='error'>{loginErr}</h2>}
                        <button className='submit-form' style={{ opacity: creatingAccount ? .4 : 1, cursor: creatingAccount ? 'no-drop' : 'pointer' }}>Login</button>
                        <span>Don't have an acoount yet ? <strong onClick={() => { setFlipCard(!flipCard); emptyFields(); setLoginErr(false) }}>Sign up</strong></span>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Signup
