import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'
export const login =async(data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/login`,data,{withCredentials:true})
    return res.data
}
export const registerUser =async(data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/signup`,data,{withCredentials:true})
    return res.data
}
export const logout =async()=>{
    let res = await axios.get(`${CONNECTION_URL}/logout`,{withCredentials:true})
    return res.data
}
export const fetchUser =async()=>{
    let res = await axios.get(`${CONNECTION_URL}/user`,{withCredentials:true})
    return res.data
}

