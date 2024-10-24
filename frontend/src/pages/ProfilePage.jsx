import React, { useEffect, useState } from 'react'
import { currentUser } from '../services/operations/Auth'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../redux/slice/auth';
import { ProfileHeader } from '../components/ProfileHeader';
import { AboutSection } from '../components/AboutSection';
import { Education } from '../components/Education';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import {PulseLoader} from "react-spinners"

export const ProfilePage = () => {

    const {username} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false)

    const fetchCurrentUser = async()=>{
        try {
            setLoading(true)
            const result = await currentUser(username,token);
            if(result){
                dispatch(setProfile(result))
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        if(token){
            fetchCurrentUser();
        }
    },[token,username])

    if(loading){
        return <PulseLoader className="size-24 flex justify-center items-center w-full h-full"/>
      }
  return (
    <div className='sm:max-w-4xl max-w-full mx-auto sm:px-8 sm:py-4 px-0 py-0 rounded-md flex flex-col gap-4'>
        <ProfileHeader/>
        <AboutSection/>
        <Experience/>
        <Education />
        <Skills/>
    </div>
  )
}
