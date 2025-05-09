import { Alert, Button, Snackbar } from '@mui/material'
import { green } from '@mui/material/colors'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { currentUser, login } from '../../Redux/Auth/Action'
import { useEffect } from 'react'

const Signin = () => {
    const [openSnackbar,setOpenSnackbar] = useState(false)
    const navigate = useNavigate()
    const {auth} = useSelector(store => store);
    const dispatch = useDispatch();
    const [inputData,setInputData] = useState({email:"" ,password: ""})
    const token = localStorage.getItem("jwt")

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("handle submit", inputData);
  
      try {
          const response = dispatch(login(inputData)); // Wait for the login API call
          console.log("Success response", response);
  
          if (auth) { // Adjust based on your API response structure
              setOpenSnackbar(true);
              navigate("/");
              console.log("Login successful");
          } else {
              setOpenSnackbar(false);
              navigate("/signup");
              console.log("Login failed");
          }
      } catch (error) {
          console.error("Login error:", error);
          setOpenSnackbar(false);
          navigate("/signin");
      }
  };
  
    const handleChange = (e) =>{
      const{name,value} = e.target;
      setInputData((values) => ({...values,[name]:value}))
  }
    const handleSnackbarClose = () =>{
        setOpenSnackbar(false)
    }

    useEffect(()=>{
        if(token)dispatch(currentUser(token))
    },[token])
    useEffect(()=>{
        if(auth.reqUser?.id){
            navigate("/")
        }
    },[auth.reqUser])
  return (
    <div className=''>
      <div className='flex justify-center h-screen items-center'>
        <div className='w-[30%] p-10 shadow-md bg-white'>
            <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                    <p className='mb-2'>Email</p>
                    <input className='py-2 px-3 outline  outline-green-600 w-full rounded-md border-black'
                        type="email" 
                        name='email'
                        placeholder='Enter your email'
                        onChange={(e) => handleChange(e)}
                        value = {inputData.email}
                        />
                </div>
                <div>
                    <p className='mb-2'>Password</p>
                    <input className='py-2 px-3 outline outline-green-600 w-full rounded-md border-black'
                        type="password" 
                        name='password'
                        placeholder='Enter your Password'
                        onChange={(e) => handleChange(e)}
                        value = {inputData.password}
                        />
                </div>
                <div>
                    <Button type='submit' sx={{bgcolor:green[700],padding:".5rem 0rem"}} className='w-full bg-green-600 hover:' variant='containded'>Sign In</Button>
                </div>
            </form>
            <div className='flex space-x-3 items-center mt-5'>
                <p className='m-0'>Create New Account</p>
                <Button variant='text'  onClick={() => navigate("/signup")}>sign up</Button>
            </div>
        </div>
      </div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
<Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}>
    <Alert onClose={handleSnackbarClose} severity='success' sx={{width:'100%'}}>Login successfully!</Alert>
  </Snackbar>
  <Snackbar
  open={!openSnackbar}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}>
    <Alert onClose={handleSnackbarClose} severity='error' sx={{width:'100%'}}>email password doesnot match</Alert>
  </Snackbar>
    </div>
  )
}

export default Signin
