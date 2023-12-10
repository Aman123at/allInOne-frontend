import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'

export const getRazorpayKey:any=async()=>{
    let res = await axios.get(`${CONNECTION_URL}/razorpaykey`,{withCredentials:true})
    return res.data
}
export const getRazorpayOrder:any=async(amount:number)=>{
    let res = await axios.post(`${CONNECTION_URL}/capturerazorpay`,{amount:amount},{withCredentials:true})
    return res.data
}