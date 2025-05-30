import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const SelectedMember = ({handleRemoveMember,member}) => {
  return (
    <div className='flex items-center bg-slate-300 rounded-full'>
        <img className='w-7 h-7 rounded-full' 
        src={member.profile_picture} alt="" />
      <p className='px-2'>{member.full_name}</p>
      <AiOutlineClose 
      className='pr-1 cursor-pointer'
      onClick={handleRemoveMember} 
      />
    </div>
  )
}

export default SelectedMember
