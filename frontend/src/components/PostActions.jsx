import React from 'react'

export const PostActions = ({icon,text,onClick}) => {
  return (
    <button className='flex items-center' onClick={onClick}>
        <span className='mr-1'>{icon}</span>
        <span>{text}</span>
    </button>
  )
}
