
// import { useNavigate } from "react-router-dom";
import { api, BASE_API_URL } from "../../config/api"
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";
import { useNavigate } from "react-router-dom";
export const register= (data) =>async(dispatch) =>{
    
    try {
        
        const res = await fetch(`${BASE_API_URL}/auth/signup`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            // mode:'no-cors',
            body:JSON.stringify(data),
            credentials : "include"
        });
        const resData = await res.json();
        console.log(resData);
        console.log("jwt " + resData.jwt)
        if(resData.jwt){
            localStorage.setItem("token",resData.jwt)
            console.log("ofsaniodngisanognogngs")
            console.log(JSON.stringify(localStorage).length)
            console.log("stored jwt ",localStorage.getItem("token"))
        }
        else{
            console.log("no JWT received")
        }
        console.log("register",resData)
        dispatch({type:REGISTER,payload:resData})
    } catch (error) {
        console.log("register",error)
        // navigate('/')
    }
}

export const login = (data) =>async(dispatch) =>{
    console.log("current user",data)
    // const navigate= useNavigate();
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body:JSON.stringify(data)
        })
        console.log(res.data)
        if(res.ok){
        
        const resData = await res.json();
        if(resData.jwt)localStorage.setItem("token",resData.jwt)
            
        console.log("login",resData)
        localStorage.setItem("token",resData.jwt)
        dispatch({type:LOGIN,payload:resData})
        
        return res.data;
        }else{
            console.log("log in falied")
            // navigate("/signin")
        }
       
    } catch (error) {
        console.log("login" ,error)
    }
}


export const currentUser = (token) =>async(dispatch) =>{
    console.log("current user action",token);

    
    try {
        // const res = await api.get('/api/users/profile',data)
        const res = await fetch(`${BASE_API_URL}/api/users/profile`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
        })
        const resData = await res.json();
        console.log("register",resData)
        dispatch({type:REQ_USER,payload:resData})
    } catch (error) {
        console.log("current User",error)
    }
}

export const searchUser = (data,tok) =>async(dispatch) =>{
    console.log("search keyword",data)
    console.log("token",tok)
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/search?query=${data}`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${tok}`,
                credentials : 'include'
            },
        })
        const resData = await res.json();
        console.log("search",resData)
        dispatch({type:SEARCH_USER,payload:resData})
    } catch (error) {
        console.log("search User",error)
    }
}

export const updateUser = (data,token) =>async(dispatch) =>{
        try {
            const res = await fetch(`${BASE_API_URL}/api/users/update/${data.id}`,{
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                },
                body:JSON.stringify(data.data)
            })
            const resData = await res.json();
            console.log("register",resData)
            dispatch({type:UPDATE_USER,payload:resData})
        } catch (error) {
            console.log("update User",error)
        }
    }


export const logoutAction = () => async(dispatch) =>{
    localStorage.removeItem("token");
    dispatch({type:LOGOUT, payload : null})
    dispatch({type:REQ_USER,payload : null})
}