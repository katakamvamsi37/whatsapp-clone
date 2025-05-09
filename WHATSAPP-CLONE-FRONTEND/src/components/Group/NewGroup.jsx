import { Button, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2 } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { createGroupChat } from '../../Redux/Chat/Action'

const NewGroup = ({groupMember}) => {
    const [isImageLoading,setIsImageLoading] = useState(false)
    const [groupName,setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null)
    const token = localStorage.getItem("token")
    const dispatch = useDispatch();
    

    const uploadToCloudinary = async (file) => {
            setIsImageLoading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "whats-app");
            data.append("cloud_name", "ddcpay4fb");
            
            try {
                const response = await fetch("https://api.cloudinary.com/v1_1/ddcpay4fb/image/upload", {
                    method: "POST",  // Changed from PUT to POST
                    body: data,
                });
                
                const result = await response.json();
                const imageUrl = result.url.toString();
                setGroupImage(imageUrl);
                isImageLoading(false);
                
            } catch (error) {
                console.error("Error uploading image:", error);
                // Add error notification here if needed
            }
        };

    const handleCreate = ({groupMember,setIsGroup}) =>{
      let userIds = [];
      for(let user of groupMember){
        userIds.push(user.id)
      }

      const group = {
        userIds , 
        chat_name : groupName,
        chat_image : groupImage,
      }
      const data = {
        group,
        token
      }

      dispatch(createGroupChat(data))
      setIsGroup(false)
    }
  return (
    <div className='w-full h-full'>
        <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
            <BsArrowLeft/>
            <p className='text-xl font-semibold'>New Group</p>
        </div>
        <div className='flex flex-col justify-center items-center my-12 '>
            <label htmlFor="imgInput" className='relative'>
                <img className='bottom-11 rounded-full h-10px '
                  src={groupImage || "https://images.pexels.com/photos/3336447/pexels-photo-3336447.jpeg?auto=compress&cs=tinysrgb&w=400" }alt="" />
            {isImageLoading && <CircularProgress className='absolute top-[5rem] left-[6rem]'/>}
            </label>
            <input type="file"
            id='imgInput'
            className='hidden'
            onChange={(e) => uploadToCloudinary(e.target.files[0])}
            />
        </div>
        <div className='w-full flex justify-between items-center py-2 px-5'>
            <input className='w-full outline-none border-b-2 border-green-700 px-2 bg-transparent' 
            value = {groupName}
            type="text"
            onChange={(e) => setGroupName(e.target.value)}
            />
        </div>
      { groupName &&   <div className='py-10 bg-slate-200 flex items-center justify-center'>
        <Button onClick={handleCreate}>
          <div className='bg-[#0c977d] rounded-full p-4'> 
            <BsCheck2 className='text-white font-bold text-3xl'/>
          </div>
        </Button>
        </div>}
    </div>
  )
}

export default NewGroup
