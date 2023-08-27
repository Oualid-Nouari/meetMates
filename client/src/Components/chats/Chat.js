import React, { useContext, useState } from 'react'
import './chat.css'
import Contacts from './Contacts'
import axios from 'axios'
import Loading from '../Loading'
import { Contexts } from '../../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft, faPaintRoller, faRightFromBracket, faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-regular-svg-icons'

const Chat = () => {
    const [contacts, setContacts] = useState(null)
    const { chatWith, setOpenMessaging, setChatWith, colors, setVariableColor, setIsDarkMode, isDarkMode, variableColor } = useContext(Contexts);
    const [openChooseTheme, setOpenChooseTheme] = useState(false)
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode)
        localStorage.setItem('isDarkMode', !isDarkMode)
    }
    axios.get(`${process.env.REACT_APP_API_URL}/friends`, {
        headers: {
            'access_header': `bearer ${localStorage.getItem('token')}`
        }
    }).then(Response => {
        setContacts(Response.data.friends.reverse())
    }).catch(err => console.log(err))
    const exitInbox = () => {
        setOpenMessaging(false)
        setChatWith(null)
    }

    const switchToColor1 = () => {
        setVariableColor('2785FF')
        localStorage.setItem('varColor', '2785FF')
    }
    const switchToColor2 = () => {
        setVariableColor('614BC3')
        localStorage.setItem('varColor', '614BC3')
    }
    const switchToColor3 = () => {
        setVariableColor('C70039')
        localStorage.setItem('varColor', 'C70039')
    }
    return (
        <div className='inbox' style={{ backgroundColor: colors.mainColor }}>
            {contacts ?
                <div className='inbox-container'>
                    <nav className='inbox-nav' style={{ backgroundColor: colors.thirdColor }}>
                        <i className='inbox-nav-icon' onClick={toggleMode}>
                            {isDarkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
                        </i>
                        <i
                            className='inbox-nav-icon theme-icon'
                            onMouseEnter={() => setOpenChooseTheme(true)}
                            onMouseLeave={() => setOpenChooseTheme(false)}
                        >
                            <FontAwesomeIcon icon={faPaintRoller} />
                            {openChooseTheme && <div className='inbox-themes' style={{ backgroundColor: colors.thirdColor }}>
                                <div className='theme' onClick={switchToColor1}>
                                    <span className='color' style={{ backgroundColor: colors.mainColor }}></span>
                                    <span className='third-color' style={{ backgroundColor: '#2785FF' }}></span>
                                </div>
                                <div className='theme' onClick={switchToColor2}>
                                    <span className='color' style={{ backgroundColor: colors.mainColor }}></span>
                                    <span className='third-color' style={{ backgroundColor: '#614BC3' }}></span>
                                </div>
                                <div className='theme' onClick={switchToColor3}>
                                    <span className='color' style={{ backgroundColor: colors.mainColor }}></span>
                                    <span className='third-color' style={{ backgroundColor: '#C70039' }}></span>
                                </div>
                            </div>}
                        </i>
                        <i className='inbox-nav-icon exit-inbox' onClick={exitInbox}><FontAwesomeIcon icon={faRightFromBracket} /></i>
                    </nav>
                    <Contacts contacts={contacts} />
                    {chatWith === null &&
                        <div className='no-contact-selected'>
                            <i><FontAwesomeIcon icon={faHandPointLeft} /></i>
                            <h2>Select a contact</h2>
                        </div>}
                </div>
                : <div> <Loading /> </div>
            }
        </div>
    )
}

export default Chat
