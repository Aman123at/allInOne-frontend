import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'
export const fetchSavedAddresses:any =
createAsyncThunk(
    'fetchSavedAddresses',
async(userId:any)=>{
    let res = await axios.get(`${CONNECTION_URL}/address/${userId}`,{withCredentials:true})
    return res.data
})

export const addNewAddress:any=async(data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/address`,data,{withCredentials:true})
    return res.data
}
export const deleteAddressById:any=async(id:any)=>{
    let res = await axios.delete(`${CONNECTION_URL}/address/${id}`,{withCredentials:true})
    return res.data
}


                                                       

