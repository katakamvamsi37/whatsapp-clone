import React, { useState, useEffect } from 'react';
import { BsArrowLeft, BsCheck2, BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../Redux/Auth/Action';
import { UPDATE_USER } from '../../Redux/Auth/ActionType';

const Profile = ({ handleCloseOpenProfile }) => {
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Initialize username when component mounts or auth changes
    useEffect(() => {
        if (auth.reqUser?.full_name) {
            setUsername(auth.reqUser.full_name);
        }
    }, [auth.reqUser,auth.UPDATE_USER]);

    const uploadToCloudinary = async (file) => {
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
            setProfilePicture(imageUrl);
            
            dispatch(updateUser({
                id: auth.reqUser.id,
                token: localStorage.getItem("token"),
                data: { profile_picture: imageUrl }
            }));
            
        } catch (error) {
            console.error("Error uploading image:", error);
            // Add error notification here if needed
        }
    };

    const handleSaveName = () => {
        if (username.trim() && username !== auth.reqUser?.full_name) {
            dispatch(updateUser({
                id: auth.reqUser?.id,
                token: localStorage.getItem("token"),
                data: { full_name: username }
            }));
        }
        // setEditMode(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveName();
        }
    };

    return (
        <div className='w-full h-full'>
            <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
                <BsArrowLeft 
                    className='cursor-pointer text-2xl font-bold' 
                    onClick={handleCloseOpenProfile}
                />
                <p className='cursor-pointer font-semibold'>Profile</p>
            </div>
            
            <div className='flex flex-col justify-center items-center my-12'>
                <label htmlFor='profileImageInput' className='cursor-pointer'>
                    <img 
                        className='rounded-full w-[15vw] h-[15vw] object-cover cursor-pointer' 
                        src={profilePicture || auth.reqUser?.profile_picture || "https://cdn.pixabay.com/photo/2019/06/03/17/43/office-4249395_1280.jpg"} 
                        alt="Profile" 
                    />
                </label>
                <input 
                    onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0])}
                    type='file' 
                    id="profileImageInput" 
                    className='hidden'
                    accept='image/*'
                />
            </div>
            
            <div className='bg-white px-3'>
                <p className='py-3'>Your Name</p>

                {!editMode ? (
                    <div className='w-full flex justify-between items-center'>
                        <p className='py-3'>{auth.reqUser?.full_name || "username"}</p>
                        <BsPencil 
                            onClick={() => setEditMode(true)} 
                            className='cursor-pointer'
                        />
                    </div>
                ) : (
                    <div className='w-full flex justify-between items-center py-2'>
                        <input 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className='w-[80%] outline-none border-b-2 border-blue-700 p-2' 
                            type='text' 
                            placeholder='Enter your name'
                            autoFocus
                        />
                        <BsCheck2 
                            onClick={handleSaveName} 
                            className='cursor-pointer text-2xl'
                        />
                    </div>
                )}
            </div>
            
            <div className='px-3 my-5'>
                <p className='py-10'>
                    This is not your username, this name will be visible to your WhatsApp contacts
                </p>
            </div>
        </div>
    );
};

export default Profile;