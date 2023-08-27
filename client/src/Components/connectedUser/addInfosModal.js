import React, { useContext, useState } from 'react'
import Default_banner from '../../imgs/default banner.png'
import Default_profile from '../../imgs/demo profile.png'
import '../../css/updateInfo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleXmark} from '@fortawesome/free-regular-svg-icons'

import axios from 'axios'
import { Contexts } from '../../contexts/contexts'
const AddInfosModal = ({setOpenInfosForm, openAddInfosForm }) => {
    const { setUser, setNewUserData, newUserData, colors } = useContext(Contexts)
    const [err, setErr] = useState('')
    const [formState, setFormState] = useState('step 1')
    const [shakeErr, setShakeErr] = useState(false);
    // HANDLING USER INFOS:
    const handleChange = (e) => {
        let {name, value} = e.target;
        setNewUserData(prev => ({
            ...newUserData,
            [name]: value,
        }))
    }
    openAddInfosForm ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'auto'
    
    //HANDLING PROFILE PICTURE:
    const handleUploadProfile = async (e) => {
        let picture = e.target.files[0]
        if(picture) {
            let ProfileBase64 = await convertToBase64(picture);
            setNewUserData({...newUserData, profileImage: ProfileBase64})
        }
    }
    // HANDLING BANNER PICTURE:
    const handleUploadBanner = async (e) => {
        let banner = e.target.files[0];
        if(banner) {
            let bannerBase64 = await convertToBase64(banner);
            setNewUserData({...newUserData, bannerImage: bannerBase64});
        }
    }
    // SUBMITTING THE FORM:
    const handelSubmit = (e) => {
        e.preventDefault();
        axios.patch(`${process.env.REACT_APP_API_URL}/user`, newUserData, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        })
        .then(Response => {
            if(Response.data.error) {
                let error = Response.data.error.toString().split(':')[2]
                setErr(error)
                setFormState('step 1');
                if(err !== '') {
                    setShakeErr(true)
                    setTimeout(() => {
                        setShakeErr(false);
                    }, 500)
                }
            } else {
                setUser(Response.data);
                setOpenInfosForm(false)
            }
        })
        .catch(err => console.log(err))
    }
    const removeProfilePicture = () => {
        setNewUserData({...newUserData, profileImage: ''})
    }
    return (
        <div>
            <form className="add-infos" onSubmit={handelSubmit} style={{backgroundColor: colors.mainColor}} >
                <i className='close-add-info' style={{color: colors.textColor}} onClick={() => setOpenInfosForm(false)}><FontAwesomeIcon icon={faCircleXmark} /></i>
                <div className='progress'>
                    <strong className='done'>1</strong>
                    <div className={formState === "step 2" ? 'line done' : 'line'}></div>
                    <strong className={formState === 'step 2' ? 'done' : ''}>2</strong>
                </div>
                <div className='infos'>
                    <div className='personal-info'>
                        <h2 style={{color: colors.textColor}}>Personal information</h2>
                        <div className='inputs'>
                            <input type="text" maxLength='25' placeholder='Full name...' name="fullName"  value={ newUserData.fullName }  onChange={handleChange} style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
                            <input type="text" maxLength="20" placeholder='@username...' name="username" value={newUserData.username}  onChange={handleChange} style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
                            <textarea placeholder='Describe Yourself...' maxLength="150" value={newUserData.bio}  name="bio" onChange={handleChange} style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
                        </div>
                    </div>
                    <div className={formState === "step 1" ? 'profileANDbanner' : 'profileANDbanner active'} style={{backgroundColor: colors.mainColor}}>
                        <h2 style={{color: colors.textColor}}>Profile & Banner pictures</h2>
                        <div className='change-pics'>
                            <div className='gradient'></div>
                            <div className='default-banner-container'>
                                <img className='banner-in-add-info-modal' src={ newUserData.bannerImage ||  Default_banner} alt="Default banner" />
                                <label htmlFor='banner' className='banner-label'>Upload banner</label>
                                <input type="file" id="banner"  name="banner" onChange={handleUploadBanner} />
                            </div>
                            <div className='default-profile-container'>
                                {newUserData.profileImage && <i class="fa-solid fa-xmark" title='Remove profile picture' onClick={removeProfilePicture}></i> }
                                <img className='default-profile' width="100px" height="100px" src={ newUserData.profileImage || Default_profile} alt="Default profile" />
                                <label htmlFor='profile' className='profile-label'>Upload profile</label>
                                <input type="file" id="profile"  name="profile" onChange={handleUploadProfile} />
                            </div>
                        </div>
                    </div>
                </div>
                {err && <div className={shakeErr ? 'err shake' : 'err'}>{err}</div>}
                <div className='buttons'>
                    <span className={formState === 'step 1' ? 'previous disabled' : 'previous enabled'} onClick={() => setFormState('step 1')}>Previous</span>
                    {formState === "step 1" ? <span className='next' onClick={() => setFormState('step 2')} style={{backgroundColor: colors.thirdColor}}>Next</span> : <button className='save' onClick={() => setFormState('step 2')}>Save</button>}
                </div>
                <div className='save-immediatly'>
                    <button className='cancel-edit' onClick={() => setOpenInfosForm(false)}>Discard</button>
                    <button className='save' onClick={() => setFormState('step 2')}>Save</button>
                </div>
            </form>
        </div>
    )
}
export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}
export default AddInfosModal;