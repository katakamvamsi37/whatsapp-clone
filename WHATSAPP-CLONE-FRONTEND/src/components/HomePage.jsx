import React, { useEffect, useState, useRef } from 'react';
import {TbCircleDashed} from 'react-icons/tb';
import {BiCommentDetail} from 'react-icons/bi';
import {AiOutlineHeatMap, AiOutlineSearch} from 'react-icons/ai';
import {BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical, BsSend} from "react-icons/bs";
import {ImAttachment} from "react-icons/im";
import ChatCard from './ChatCard/ChatCard';
import { Button, Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import MessageCard from './MessageCard/MessageCard';
import './Status/css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile/Profile';
import CreateGroup from './Group/CreateGroup';
import { useSelector } from 'react-redux';
import { currentUser, logoutAction, searchUser } from '../Redux/Auth/Action';
import {createChat, getUsersChat} from '../Redux/Chat/Action';
import { createMessage, getAllMessages } from '../Redux/Message/Action';
import EmojiPicker from 'emoji-picker-react';

const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png";

const HomePage = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const token = localStorage.getItem("token");
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    navigate("/profile")
  };
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [isGroup, setIsGroup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  const {auth, chat, message} = useSelector(store => store);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Safe profile picture getter
  const getSafeProfilePicture = (user) => {
    if (!user) return DEFAULT_PROFILE_PIC;
    return user.profile_picture || DEFAULT_PROFILE_PIC;
  };

  // Get chat participant info safely
  const getChatParticipant = (chat) => {
    if (!chat || !chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find(user => user?.id !== auth.reqUser?.id) || null;
  };

  const handleClickOnChatCard = (item) => {
    if (item.is_group) {
      setCurrentChat(item);
    } else {
      dispatch(createChat({token, data: {userId: item.id}}))
      setCurrentChat(item);
    }
    setQuerys("")
  }

  const handleSearch = (keyword) => {
    dispatch(searchUser(keyword,token))
  };

  const handleCreateNewMessage = async () => {
    if (content.trim() || selectedImage) {
      let imageUrl = null;
      
      if (selectedImage) {
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "whats-app");
        data.append("cloud_name", "ddcpay4fb");
        
        try {
          const response = await fetch("https://api.cloudinary.com/v1_1/ddcpay4fb/image/upload", {
            method: "POST",
            body: data,
          });
          
          const result = await response.json();
          imageUrl = result.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return;
        }
      }

      dispatch(createMessage({
        token, 
        data: {
          chatId: currentChat.id,
          content: content,
          image: imageUrl
        }
      }));
      
      // Reset form
      setContent("");
      setSelectedImage(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const cancelImagePreview = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
  };

  useEffect(() => {
    dispatch(getUsersChat({token}))
  },[chat.createdChat, chat.createdGroup]);

  useEffect(()=>{
    if(currentChat?.id){
      dispatch(getAllMessages({chatId : currentChat.id , token}))
    }
  },[currentChat, message.newMessage]);

  const handleNavigate = () => {
    setIsProfile(true);
  };

  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  useEffect(() => {
    dispatch(currentUser(token))
  },[token]);

  const handleLogOut = () => {
    dispatch(logoutAction())
    navigate("/signup")
  };

  useEffect(() => {
    if(!auth.reqUser) {
      navigate("/signup")
    }
  },[auth.reqUser]);

  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  };

  return (
    <div className='relative'>
      <div className='w-full py-14 bg-[#00a884]'>
        <div className='flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] w-[96vw] top-[vh]'>
          {/* Left sidebar */}
          <div className='left w-[30%] bg-[#e8e9ec] h-full'>
            {isGroup && <CreateGroup handleReverse setIsGroup={setIsGroup}/>}
            {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile}/></div>}
            
            {!isProfile && !isGroup && (
              <div className='w-full'>
                {/* Profile header */}
                <div className='flex justify-between items-center px-5 py-3'>
                  <div onClick={handleNavigate} className='flex items-center space-x-3'>
                    <img 
                      className='rounded-full w-10 h-10 cursor-pointer' 
                      src={auth.reqUser?.profile_picture}
                      alt="profile"
                    />
                    <p>{auth.reqUser?.full_name}</p>
                  </div>
                  <div className='space-x-3 text-2xl flex'>
                    <TbCircleDashed className='cursor-pointer' onClick={()=>navigate("/status")}/>
                    <BiCommentDetail/>
                    <div>
                      <BsThreeDotsVertical 
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      />
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                
                {/* Search bar */}
                <div className='relative flex justify-center items-center bg-white py-4 px-3'>
                  <input 
                    className='border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2'
                    type="text" 
                    placeholder='Search for start new chat'
                    onChange={(e)=>{
                      setQuerys(e.target.value)
                      handleSearch(e.target.value)
                    }}
                    value={querys}
                  />
                  <AiOutlineSearch className='left-7 top-7 absolute'/>
                  <div>
                    <BsFilter className='ml-4 text-3xl'/>
                  </div>
                </div>
                
                {/* Chat list */}
                <div className='bg-white overflow-y-scroll h-[72vh] px-6'>
                  {querys && auth.searchUser?.map((item) => (
                    <div key={item.id} onClick={() => handleClickOnChatCard(item)}>
                      <hr/> 
                      <ChatCard 
                        name={item.full_name}
                        userImg={getSafeProfilePicture(item)}
                        item={item}
                      />
                    </div>
                  ))}

                  {chat.chats.length > 0 && !querys && chat.chats?.map((item) => (
                    <div key={item.id} onClick={() => handleCurrentChat(item)}>
                      <hr/> 
                      {item.is_group ? (
                        <ChatCard
                          name={item.full_name}
                          userImg={getSafeProfilePicture(item)}
                          item={item}
                        />
                      ) : (
                        <ChatCard 
                          isChat={true} 
                          name={getChatParticipant(item)?.full_name || "Unknown User"}
                          userImg={getSafeProfilePicture(getChatParticipant(item))}
                          item={item}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right content area */}
          {!currentChat ? (
            <div className='w-[70%] h-full flex flex-col items-center justify-center'>
              <div className='max-w-full text-center'>
                <img src="/images/solo.png" alt="default home page" />
                <h1 className='text-4xl text-gray-600'>WhatsApp Web</h1>
                <p className='my-9'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quos qui repellat voluptas enim eius!</p>
              </div>
            </div>
          ) : (
            <div className='w-[70%] relative'>
              {/* Chat header */}
              <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
                <div className='flex justify-between'>
                  <div className='py-3 space-x-4 flex items-center px-3'>
                    <img 
                      className='w-10 h-10 rounded-full' 
                      src={
                        currentChat.is_group 
                          ? getSafeProfilePicture(currentChat)
                          : getSafeProfilePicture(getChatParticipant(currentChat))
                      }
                      alt="chat user" 
                    />
                    <p>
                      {currentChat.is_group 
                        ? currentChat.chat_name 
                        : getChatParticipant(currentChat)?.full_name || "Unknown User"}
                    </p>
                  </div>
                  <div className='py-3 flex space-x-4 items-center px-3'>
                    <AiOutlineSearch/>
                    <BsThreeDotsVertical/>
                  </div>
                </div>
              </div>
              
              {/* Messages area */}
              <div className='px-8 py-10 h-[85vh] overflow-y-scroll bg-blue-200'>
                <div className='space-y-1 flex flex-col justify-center mt-2 px-10 py-10'>
                  {message.messages?.length > 0 && message.messages?.map((item) => (
                    <MessageCard 
                    
                      key={item.id || item._id}
                      isReqUserMessage={item.user?.id !== auth.reqUser?.id}
                      content={item.content}
                      useImage={item.image}
                    />
                  ))}
                </div>
              </div>

              {/* Image preview */}
              {previewImage && (
                <div className='relative bg-gray-100 p-2'>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className='max-h-40 rounded'
                  />
                  <button 
                    onClick={cancelImagePreview}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Message input */}
              <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
                <div className='flex justify-between items-center px-5 relative'>
                  <div className='relative'>
                    <BsEmojiSmile 
                      className='cursor-pointer'
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                      <div 
                        className='absolute bottom-10 left-0 z-10'
                        ref={emojiPickerRef}
                      >
                        <EmojiPicker 
                          onEmojiClick={handleEmojiClick}
                          width={300}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                  
                  <label className='cursor-pointer'>
                    <ImAttachment/>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className='hidden'
                    />
                  </label>
                  
                  <input
                    className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                    type='text' 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Type message'
                    value={content}
                    onKeyPress={(e) => {
                      if(e.key === "Enter") {
                        handleCreateNewMessage();
                      }
                    }}
                  />
                  
                  <button 
                    onClick={handleCreateNewMessage}
                    className='bg-[#008069] text-white p-2 rounded-full'
                  >
                    <BsSend className='text-xl'/>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage;


// import React, { useEffect, useState } from 'react'
// import {TbCircleDashed} from 'react-icons/tb'
// import {BiCommentDetail} from 'react-icons/bi'
// import {AiOutlineHeatMap, AiOutlineSearch} from 'react-icons/ai'
// import {BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical} from "react-icons/bs"
// import {ImAttachment} from "react-icons/im"
// import ChatCard from './ChatCard/ChatCard'
// import { Button, Menu, MenuItem } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import MessageCard from './MessageCard/MessageCard'
// import './Status/css/HomePage.css'
// import { useNavigate } from 'react-router-dom'
// import Profile from './Profile/Profile'
// import CreateGroup from './Group/CreateGroup'
// import { useSelector } from 'react-redux'
// import { currentUser, logoutAction, searchUser } from '../Redux/Auth/Action'
// import {createChat, getUsersChat} from '../Redux/Chat/Action'
// import { createMessage, getAllMessages } from '../Redux/Message/Action'

// const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png";

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const token = localStorage.getItem("token")
//   const open = Boolean(anchorEl);
//   const handleClick = (e) => {
//     setAnchorEl(e.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     navigate("/profile")
//   };
//   const [querys, setQuerys] = useState("");
//   const [currentChat, setCurrentChat] = useState(null)
//   const [content, setContent] = useState("")
//   const [isProfile, setIsProfile] = useState(false)
//   const navigate = useNavigate();
//   const [isGroup, setIsGroup] = useState(false)
  
//   const {auth, chat, message} = useSelector(store => store)

//   // Safe profile picture getter
//   const getSafeProfilePicture = (user) => {
//     if (!user) return DEFAULT_PROFILE_PIC;
//     return user.profile_picture || DEFAULT_PROFILE_PIC;
//   };

//   // Get chat participant info safely
//   const getChatParticipant = (chat) => {
//     if (!chat || !chat.users || !Array.isArray(chat.users)) return null;
    
//     // Find the other participant (not the current user)
//     return chat.users.find(user => user?.id !== auth.reqUser?.id) || null;
//   };

//   const handleClickOnChatCard = (item) => {
//     if (item.is_group) {
//       setCurrentChat(item);
//     } else {
//       dispatch(createChat({token, data: {userId: item.id}}))
//       setCurrentChat(item);
//     }
//     setQuerys("")
//   }

//   const handleSearch = (keyword) => {
//     dispatch(searchUser(keyword,token))
//   };

//   const handleCreateNewMessage = () => {
//     dispatch(createMessage({token,data : {chatId : currentChat.id,content : content}}))
//     // Implement message creation logic here
//   }

//   useEffect(() => {
//     dispatch(getUsersChat({token}))
//   },[chat.createdChat, chat.createdGroup])

//   useEffect(()=>{
//     if(currentChat?.id){
//     dispatch(getAllMessages({chatId : currentChat.id , token}))
//     }
//   },[currentChat,message.newMessage])
//   const handleNavigate = () => {
//     setIsProfile(true)
//   }

//   const handleCloseOpenProfile = () => {
//     setIsProfile(false)
//   }

//   const handleCreateGroup = () => {
//     setIsGroup(true)
//   }

//   useEffect(() => {
//     dispatch(currentUser(token))
//   },[token])

//   const handleLogOut = () => {
//     dispatch(logoutAction())
//     navigate("/signup")
//   }

//   useEffect(() => {
//     if(!auth.reqUser) {
//       navigate("/signup")
//     }
//   },[auth.reqUser])

//   const handleCurrentChat = (item) => {
//     setCurrentChat(item)
//   }

//   return (
//     <div className='relative'>
//       <div className='w-full py-14 bg-[#00a884]'>
//         <div className='flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] w-[96vw] top-[vh]'>
//           {/* Left sidebar */}
//           <div className='left w-[30%] bg-[#e8e9ec] h-full'>
//             {isGroup && <CreateGroup handleReverse setIsGroup={setIsGroup}/>}
//             {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile}/></div>}
            
//             {!isProfile && !isGroup && (
//               <div className='w-full'>
//                 {/* Profile header */}
//                 <div className='flex justify-between items-center px-5 py-3'>
//                   <div onClick={handleNavigate} className='flex items-center space-x-3'>
//                     <img 
//                       className='rounded-full w-10 h-10 cursor-pointer' 
//                       src={auth.reqUser?.profile_picture}
//                       alt="profile"
//                     />
//                     <p>{auth.reqUser?.full_name}</p>
//                   </div>
//                   <div className='space-x-3 text-2xl flex'>
//                     <TbCircleDashed className='cursor-pointer' onClick={()=>navigate("/status")}/>
//                     <BiCommentDetail/>
//                     <div>
//                       <BsThreeDotsVertical 
//                         id="basic-button"
//                         aria-controls={open ? 'basic-menu' : undefined}
//                         aria-haspopup="true"
//                         aria-expanded={open ? 'true' : undefined}
//                         onClick={handleClick}
//                       />
//                       <Menu
//                         id="basic-menu"
//                         anchorEl={anchorEl}
//                         open={open}
//                         onClose={handleClose}
//                         MenuListProps={{
//                           'aria-labelledby': 'basic-button',
//                         }}
//                       >
//                         <MenuItem onClick={handleClose}>Profile</MenuItem>
//                         <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
//                         <MenuItem onClick={handleLogOut}>Logout</MenuItem>
//                       </Menu>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Search bar */}
//                 <div className='relative flex justify-center items-center bg-white py-4 px-3'>
//                   <input 
//                     className='border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2'
//                     type="text" 
//                     placeholder='Search for start new chat'
//                     onChange={(e)=>{
//                       setQuerys(e.target.value)
//                       handleSearch(e.target.value)
//                     }}
//                     value={querys}
//                   />
//                   <AiOutlineSearch className='left-7 top-7 absolute'/>
//                   <div>
//                     <BsFilter className='ml-4 text-3xl'/>
//                   </div>
//                 </div>
                
//                 {/* Chat list */}
//                 <div className='bg-white overflow-y-scroll h-[72vh] px-6'>
//                   {querys && auth.searchUser?.map((item) => (
//                     <div key={item.id} onClick={() => handleClickOnChatCard(item)}>
//                       <hr/> 
//                       <ChatCard 
//                         name={item.full_name}
//                         userImg={getSafeProfilePicture(item)}
//                         item={item}
//                       />
//                     </div>
//                   ))}

//                   {chat.chats.length > 0 && !querys && chat.chats?.map((item) => (
//                     <div key={item.id} onClick={() => handleCurrentChat(item)}>
//                       <hr/> 
//                       {item.is_group ? (
//                         <ChatCard
//                           name={item.full_name}
//                           userImg={getSafeProfilePicture(item)}
//                           item={item}
//                         />
//                       ) : (
//                         <ChatCard 
//                           isChat={true} 
//                           name={getChatParticipant(item)?.full_name || "Unknown User"}
//                           userImg={getSafeProfilePicture(getChatParticipant(item))}
//                           item={item}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Right content area */}
//           {!currentChat ? (
//             <div className='w-[70%] h-full flex flex-col items-center justify-center'>
//               <div className='max-w-full text-center'>
//                 <img src="/images/solo.png" alt="default home page" />
//                 <h1 className='text-4xl text-gray-600'>WhatsApp Web</h1>
//                 <p className='my-9'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quos qui repellat voluptas enim eius!</p>
//               </div>
//             </div>
//           ) : (
//             <div className='w-[70%] relative'>
//               {/* Chat header */}
//               <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
//                 <div className='flex justify-between'>
//                   <div className='py-3 space-x-4 flex items-center px-3'>
//                     <img 
//                       className='w-10 h-10 rounded-full' 
//                       src={
//                         currentChat.is_group 
//                           ? getSafeProfilePicture(currentChat)
//                           : getSafeProfilePicture(getChatParticipant(currentChat))
//                       }
//                       alt="chat user" 
//                     />
//                     <p>
//                       {currentChat.is_group 
//                         ? currentChat.chat_name 
//                         : getChatParticipant(currentChat)?.full_name || "Unknown User"}
//                     </p>
//                   </div>
//                   <div className='py-3 flex space-x-4 items-center px-3'>
//                     <AiOutlineSearch/>
//                     <BsThreeDotsVertical/>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Messages area */}
//               <div className='px-8 py-10 h-[85vh] overflow-y-scroll bg-blue-200'>
//                 <div className='space-y-1 flex flex-col justify-center mt-2 px-10 py-10'>
//                   {message.messages?.length > 0 && message.messages?.map((item, i) => (
//                     <MessageCard 
//           key={item.id || item._id}  // Use proper unique identifier
//           isReqUserMessage={item.sender?._id === auth.reqUser?._id} 
//           content={item.content}
//         />
//                   ))}
//                 </div>
//               </div>
//               {/* Messages area */}
//                {/* <div className='px-8 py-10 h-[85vh] overflow-y-scroll bg-blue-200'>
//                               <div className='space-y-1 flex flex-col justify-center mt-2 px-10 py-10'>
//                   {message.messages?.length > 0 ? (
//                     message.messages.map((item,i) => (
//                       <MessageCard  // Use proper unique identifier
//                       isReqUserMessage={item.user?.id !== auth.reqUser?.id} 
//                       content={item.content}
//                     />
//                     ))
//                   ) : (
//                     <div className='flex items-center justify-center h-full'>
//                       <p className='text-gray-500'>No messages yet</p>
//                     </div>
//                   )}
//                 </div> 
//               </div>    */}
//               {/* Message input */}
//               <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
//                 <div className='flex justify-between items-center px-5 relative'>
//                   <BsEmojiSmile className='cursor-pointer'/>
//                   <ImAttachment/>
//                   <input 
//                     className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
//                     type='text' 
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder='Type message'
//                     value={content}
//                     onKeyPress={(e) => {
//                       if(e.key === "Enter") {
//                         handleCreateNewMessage();
//                         setContent("")
//                       }
//                     }}
//                   />
//                   <BsMicFill />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HomePage;




// import React, { useEffect, useState } from 'react'
// import {TbCircleDashed}  from 'react-icons/tb'
// import {BiCommentDetail} from 'react-icons/bi'
// import {AiOutlineHeatMap, AiOutlineSearch} from 'react-icons/ai'
// import {BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical} from "react-icons/bs"
// import {ImAttachment} from "react-icons/im"
// import ChatCard from './ChatCard/ChatCard'
// import { Button, Menu, MenuItem } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import MessageCard from './MessageCard/MessageCard'
// import './Status/css/HomePage.css'
// import { useNavigate } from 'react-router-dom'
// import Profile from './Profile/Profile'
// import CreateGroup from './Group/CreateGroup'
// import { useSelector } from 'react-redux'
// import { currentUser, logoutAction, searchUser } from '../Redux/Auth/Action'
// import {createChat, getUsersChat} from '../Redux/Chat/Action'
   
//   const HomePage = () => {
//     const dispatch = useDispatch();
//     const [anchorEl, setAnchorEl] = useState(null);
//     const token = localStorage.getItem("token")
//   const open = Boolean(anchorEl);
//   const handleClick = (e) => {
//     setAnchorEl(e.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//     const[querys,setQuerys] = useState(null);
//     const [currentChat,setCurrentChat] = useState(null)
//     const [content,setContent] = useState("")
//     const [isProfile,setIsProfile] = useState(false)
//     const navigate = useNavigate();
//     const [isGroup,setIsGroup] = useState(false)
    
//     const {auth,chat,message} = useSelector(store => store)
//     const handleClickOnChatCard = (item,userId) =>{
//       // setCurrentChat(true)
//       // setCurrentChat(item)
//       console.log(userId)
//       dispatch(createChat({token, data : {userId}}))
//       setQuerys("")
//     }
//     const handleSearch = (keyword) =>{
//       dispatch(searchUser(keyword,token))
//     };
//     const handleCreateNewMessage = () =>{
//     }
//     useEffect(() =>{
//       dispatch(getUsersChat({token}))
//     },[chat.createdChat,chat.createdGroup])
//     const handleNavigate = () =>{
//       // navigate("/profile")
//       setIsProfile(true)
//     }
//     const handleCloseOpenProfile = () =>{
//       setIsProfile(false)
//     }

//     const handleCreateGroup = () =>{
//       setIsGroup(true)
//     }

//     const handleCreateChat = (usedId) =>{
//       dispatch(createChat())
//     }
    
//     useEffect (() =>{
//       dispatch(currentUser(token))
//     },[token])


//     const handleLogOut = () =>{
//       dispatch(logoutAction())
//       // localStorage.removeItem("token")
//       navigate("/signup")
//     }


//     useEffect(()=>{
//       if(!auth.reqUser){
//         navigate("/signup")
//       }
//     },[auth.reqUser])

//     const handleCurrentChat = (item) =>{
//       setCurrentChat(item)
//     }
//     console.log("currentChat",currentChat)
//   return (
//   <div className='relative'>
//   <div className='w-full py-14 bg-[#00a884]'>
//     <div className='flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] w-[96vw] top-[vh]   '>
//         <div className='left w-[30%] bg-[#e8e9ec] h-full'>
//           {isGroup && <CreateGroup handleReverse/>}
//           {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile}/></div>}
//             { !isProfile && !isGroup && <div className='w-full '>
//               {/* profile page */}
              
//               {/* home page */}
//               {!isProfile &&  <div className='flex justify-between items-center px-5 py-3'>
//                     <div onClick={handleNavigate} className='flex items-center space-x-3'>
//                         <img className='rounded-full w-10 h-10 cursor-pointer' 
//                         src={ "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png"} 
//                         alt="image not found"/>
//                         <p>{auth.reqUser?.full_name}</p>
//                     </div>
//                     <div className='space-x-3 text-2xl flex'>
//                         <TbCircleDashed className='cursor-pointer' onClick={()=>navigate("/status")}/>
//                         <BiCommentDetail/>
//                         <div>
                        
//        <BsThreeDotsVertical id="basic-button"
//         aria-controls={open ? 'basic-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}/>
//                         <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'basic-button',
//         }}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
//         <MenuItem onClick={handleLogOut}>Logout</MenuItem>
//       </Menu>
//                         </div>
                        
//                     </div>
//                 </div>}
//                 <div className='relative flex justify-center items-center bg-white py-4 px-3'>
//                     <input className='border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2'
//                     type="text" 
//                     placeholder='Search for start new chat'
//                     onChange={(e)=>{
//                       setQuerys(e.target.value)
//                       handleSearch(e.target.value)
//                     }}
//                     value={querys}
//                     />
//                     <AiOutlineSearch className='left-7 top-7 absolute'/>
//                     <div>
//                         <BsFilter className='ml-4 text-3xl'/>
//                     </div>
//                 </div>
//                 {/* all users */}
//                 <div className='bg-white overflow-y-scroll h-[72vh] px-6'>
                  
//                 {querys && auth.searchUser?.map((item) => 
//                 <div onClick={() => handleClickOnChatCard(item.id)}> {""}
//                   <hr/> <ChatCard 
//                   name={item.full_name}
//                   userImg = {
//                     item.profile_picture || "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png"
//                   }
//                   item={item}/>{""}</div>)}

//                 {chat.chats.length > 0 && !querys && chat.chats?.map((item) => 
//                   <div onClick={() => handleCurrentChat(item.id)}> {""}
//                 <hr/> 
//                 {item.is_group ? (<ChatCard
//                 name = {item.full_name}
//                 userImg={item.profile_picture || "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png" }
//                 item={item}/>) : 
//                 (
//                   <ChatCard isChat={true} 
//                   name={auth.reqUser?.id !== item.users[0]?.id
//                     ? item.users[0]. full_name
//                     : item.users[1].full_name
//                   }
//                   userImg ={
//                     auth.reqUser.id != item.users[0].id
//                     ? item.users[0].profile_picture || "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png"
//                     : item.users[1].profile_picture || 
//                     "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png"
//                   }
//                   // notification = {notification.length}
//                   // isNotification ={
//                   //   notification[0] ?. chat?.id === item.id
//                   // }
//                   // messages = {
//                   //   {(item.id === 
//                   //     message[message.length-1] ?.chat?.id && 
//                   //     message[message.length-1] ?. content) || 
//                   //     (item.id === notification[0]?.chat?.id && notification[0]?.content)
//                   //   }
//                   // }
//                   />
//                 )}
                
                
                
//                 </div>)}
//                   </div>
//             </div>}
//             <div>
//               {/* default whats up page  */}
//             </div>
//         </div>
    
//       { !currentChat && <div className='  w-[70%] h-full flex flex-col items-center justify-center  '>
//         <div className='max-w-full text-center'>
//           <img src="/images/solo.png" alt="default home page not found" />
//           <h1 className='text-4xl  text-gray-600'>WhatsApp Web</h1>
//           <p className='my-9'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quos qui repellat voluptas enim eius!</p>
//         </div>

//       </div>}
//       {/* message part */}
//     { currentChat && <div className='w-[70%] relative'>
//       <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
//         <div className='flex justify-between'>
//           <div className='py-3 space-x-4 flex items-center px-3'>
//             <img className='w-10 h-10 rounded-full' src="https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png" alt="not found" />
//             <p>
//               {/* {currentChat && auth.reqUser?.id === currentChat.users[0]?.id
//                 ? currentChat.users[1]?.full_name
//                 : currentChat.users[0]?.full_name} */}
//                 avams
//             </p>
//           </div>
//           <div className='py-3 flex space-x-4 items-center px-3'>
//             <AiOutlineSearch/>
//             <BsThreeDotsVertical/>
//           </div>
//         </div>
//       </div>
//         {/* message section */}

//       <div className='px-8 py-10 h-[85vh] overflow-y-scroll bg-blue-200'>
//         <div className='space-y-1 flex flex-col justify-center mt-2  px-10 py-10'>
//           {[1,1,1,1,1].map((item,i) =><MessageCard key={item} isReqUserMessage={i%2==0} content={"message"}/>)}
//         </div>
//       </div>

//       {/* footer part */}
//       <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
//         <div className='flex justify-between items-center px-5 relative'>
        
//           <BsEmojiSmile className='cursor-pointer'/>
//           <ImAttachment/>
//         <input className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
//          type='text' 
//          onChange={(e) => setContent(e.target.value)}
//          placeholder='Type message'
//          value={content}
//          onKeyPress={(e) =>{
//           if(e.key == "Enter"){
//             handleCreateNewMessage();
//             setContent("")
//           }
//          }}
//          />
//          <BsMicFill />
//          </div>
//       </div>
//       </div>}
//   </div>
// </div>
//   </div>
//   )
//   }

//   export default HomePage; 