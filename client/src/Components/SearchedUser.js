import React, { useContext, useState } from 'react'
import Default_profile from '../imgs/demo profile.png'
import { Contexts } from '../contexts/contexts'

const SearchedUser = ({ searchedUser }) => {
    const { colors } = useContext(Contexts);
    const [isHovered, setIsHovered] = useState('');
    const pathToProfile = `/users/${searchedUser._id}`
    return (
        <React.Fragment>
            {searchedUser ?
                <a
                    href={pathToProfile}
                    target='_blanck'
                    className='searched-user'
                    onMouseEnter={() => setIsHovered(searchedUser._id)}
                    onMouseLeave={() => setIsHovered('')}
                    style={
                        {
                            backgroundColor: isHovered === searchedUser._id ? colors.secondColor : colors.mainColor,
                            color: colors.textColor,
                            borderBottom: `1px solid ${colors.fourthColor}`
                        }
                    }>
                    <img src={searchedUser.profileImage || Default_profile} alt="profile" className='searched-user-profile' />
                    <p>{searchedUser.username}</p>
                </a> : <div className='lazy-loading' style={{color: colors.textColor}}>Loading</div>
            }
        </React.Fragment>
    )
}

export default SearchedUser
