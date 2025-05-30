import React, { useEffect, useState } from 'react'
import { stories } from './DummyStory'
import ProgressBar from './ProgressBar';
import { BsArrowLeft } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const StatusViewers = () => {
    const navigate = useNavigate();
    const [currentStoryIndex,setCurrentStoryIndex] = useState(0);
    const [activeIndex,setActiveIndex] = useState(0)
    const handleNextStroy = () =>{
        if(currentStoryIndex < stories?.length -1)
        {
            setCurrentStoryIndex(currentStoryIndex+1);
            setActiveIndex(activeIndex+1)
        }else{
            setCurrentStoryIndex(0);
            setActiveIndex(0);
        }
    }

        useEffect(()=>{
            const intervalid = setInterval(()=>{
                handleNextStroy();
            },2000)
            return () =>clearInterval(intervalid);
        },[currentStoryIndex])
    const handleNavigate= () =>{
        navigate(-1)
    }
    return (
    <div>
      <div className='relative flex justify-center items-center h-[100vh] bg-slate-900'>
        <div className='relative'>
            <img className='max-h-[96vh] object-contain'
            src={stories?.[currentStoryIndex].image} alt="image not found" />
            <div className='absolute top-0 flex w-full'>
                {stories.map((item,index)=><ProgressBar key={index} duration={2000} index={index} activeIndex={activeIndex}/>)}
            </div>
        </div>
        <div>
            <BsArrowLeft onClick={handleNavigate} className='text-white text-2xl cursor-pointer absolute top-5 left-10'/>
            <AiOutlineClose onClick={handleNavigate} className='text-white text-2xl cursor-pointer absolute top-5 right-10'/>
        </div>
      </div>
    </div>
  )
}

export default StatusViewers;
