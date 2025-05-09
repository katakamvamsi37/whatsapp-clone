import axios from "axios"


export const BASE_API_URL = "http://localhost:9090"


export const api = axios.create({
    baseURL:"http://localhost:9090"
})

export async function addUser(full_name,email,password)
{
    const formData = new FormData();
    formData.append("full_name",full_name)
    formData.append("email",email)
    formData.append("password",password)

    try{
    const response = await api.post(`${BASE_API_URL}/auth/signup`,formData)
        const resData = await response.json()
        if(resData.jwt){localStorage.setItem("token",resData.jwt)}
        else{
            console.log("no JWT received")
        }
        console.log("register",resData)
    }catch(error){
       console.log(error)
    }
}
// export async function verify(email,password)
// {
//     const formData = new FormData();
//     formData.append("email",email)
//     formData.append("password",password)
//     const response = await api.post(`${BASE_API_URL}/auth/signin`,formData)
//     if(response === 201)
//     {
//         return true;
//     }else {
//         false;
//     }
// }