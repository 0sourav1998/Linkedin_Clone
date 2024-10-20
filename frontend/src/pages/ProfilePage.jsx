import React, { useEffect } from 'react'
import { currentUser } from '../services/operations/Auth'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../redux/slice/auth';
import { ProfileHeader } from '../components/ProfileHeader';
import { AboutSection } from '../components/AboutSection';
import { Education } from '../components/Education';
import { Skills } from '../components/Skills';

export const ProfilePage = () => {

    const {username} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    const fetchCurrentUser = async()=>{
        try {
            const result = await currentUser(username,token);
            if(result){
                dispatch(setProfile(result))
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(()=>{
        if(token){
            fetchCurrentUser();
        }
    },[token,username])
  return (
    <div className='max-w-4xl mx-auto shadow-md px-8 py-4 rounded-md'>
        <ProfileHeader/>
        <AboutSection/>
        <Education />
        <Skills/>
    </div>
  )
}
