import React, { useContext, useState } from 'react'
import { Contexts } from '../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faMoon } from '@fortawesome/free-regular-svg-icons'
import { faRightFromBracket, faSun } from '@fortawesome/free-solid-svg-icons'

const Settings = ({ openSettings, setOpenSettings }) => {
  const { setUser, setIsDarkMode, isDarkMode, colors } = useContext(Contexts)
  const [isHovered, setIsHovered] = useState('') // for themes
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    window.location.assign('/sign')
  }
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('isDarkMode', !isDarkMode)
  }
  return (
    <React.Fragment>
      {openSettings && <div className='settings-overlay' onClick={() => setOpenSettings(false)}></div>}
        <div className={openSettings ? 'settings active' : 'settings'} style={{ backgroundColor: colors.mainColor }}>
          <h2 style={{ color: colors.textColor }}>Settings</h2>
          <ul>
            <a href="/profile">
              <li
                style={
                  { color: colors.textColor, 
                    backgroundColor: isHovered === "profile" ? colors.secondColor : colors.mainColor,
                    borderBottom: `1px solid ${colors.fourthColor}`
                  }
                }
                className='settings-item'
                onMouseEnter={() => setIsHovered('profile')}
                onMouseLeave={() => setIsHovered('')}
              >
                <i><FontAwesomeIcon icon={faCircleUser} /></i>
                Your profile
              </li>
            </a>
            <li
              className='settings-item'
              onClick={toggleMode}
              style={
                { 
                  color: colors.textColor, 
                  backgroundColor: isHovered === "dark-mode" ? colors.secondColor : colors.mainColor,
                  borderBottom: `1px solid ${colors.fourthColor}`
                }
              }
              onMouseEnter={() => setIsHovered('dark-mode')}
              onMouseLeave={() => setIsHovered('')}
            >
              <i>{isDarkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} /> }</i> {isDarkMode ? 'Light Mode' : 'Dark mode'}
            </li>
            <a href="/"><li className='logout' onClick={logout} style={{ color: colors.textColor }}><i><FontAwesomeIcon icon={faRightFromBracket} /></i> Log out</li></a>
          </ul>
        </div>
    </React.Fragment>
  )
}

export default Settings
