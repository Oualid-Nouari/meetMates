import React, { useContext } from 'react'
import Contact from './Contact'
import { Contexts } from '../../contexts/contexts'

const ChatApp = ({contacts}) => {
    const { colors } = useContext(Contexts)
    return (
        <div className='contacts' style={{backgroundColor: colors.secondColor, borderRight: `1px solid ${colors.fourthColor}`}}>
            <div className='contacts-list'>
                <header className='contacts-list-header'>
                    <h4 style={{color: colors.textColor}}>Contatcs</h4>
                </header>
                <ul>
                    {contacts.map((contact, index) => {
                        return <Contact contact={contact} key={index} />
                    })}
                </ul>
            </div>
        </div>
    )
}

export default ChatApp
