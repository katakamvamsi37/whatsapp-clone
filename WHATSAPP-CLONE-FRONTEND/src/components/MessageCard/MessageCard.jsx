import React from 'react'

const MessageCard = ({ isReqUserMessage, content }) => {
  return (
    <div className={`py-2 px-3 rounded-md max-w-[50%] ${isReqUserMessage ? "self-end bg-[#d9fdd3]" : "self-start bg-white"} shadow`}>
      <p>{content}</p>
    </div>
  )
}

export default MessageCard
