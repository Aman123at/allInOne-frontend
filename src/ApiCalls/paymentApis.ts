import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'

export const getRazorpayKey:any=async()=>{
    let res = await axios.get(`${CONNECTION_URL}/razorpaykey`,{withCredentials:true})
    return res.data
}