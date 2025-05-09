// import React from 'react';

// const ChatCard = ({ userImg, name, item, isChat }) => {
//   return (
//     <div className='flex items-center justify-between py-3 cursor-pointer hover:bg-gray-100 rounded-md px-2'>
//       <div className='flex items-center space-x-3'>
//         <img className='h-12 w-12 rounded-full' src={userImg} alt='' />
//         <div>
//           <p className='text-lg font-semibold'>{name}</p>
//           <p className='text-sm text-gray-500'>{isChat ? item.lastMessage?.content : 'Start a new chat'}</p>
//         </div>
//       </div>

//       {/* <div className='flex flex-col items-end'>
//         {isChat && <p className='text-xs text-gray-400'>{item.lastMessage?.time}</p>}
//         {item.unreadCount > 0 && (
//           <p className='text-xs py-1 px-2 text-white bg-green-500 rounded-full'>{item.unreadCount}</p>
//         )}
//       </div> */}
//     </div>
//   );
// };

// export default ChatCard;


import React from 'react'

const ChatCard = ({userImg,name}) => {
    
  return (
    <div className='flex items-center justify-center py-2 group cursor-pointer'>
        <div className='w-[20%]'>
        <img className='h-14 w-14 rounded-full'
        src={userImg} alt=''/>
        </div>
        <div className='pl-0 w-[80%]'>
            <div className='flex justify-between items-center'>
                <p className='text-lg'>{name}</p>
                <p className='text-sm'></p>
            </div>
            <div className='flex justify-between items-center'>
                <p></p>
                <div className='flex space-x-2 items-center'>
                    <p className='text-xs py-1 px-2 text-white bg-green-500 rounded-full'>5</p>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default ChatCard
