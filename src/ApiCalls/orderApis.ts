import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'
export const getAllOrders:any =
createAsyncThunk(
    'getAllOrders',
async()=>{
    let res = await axios.get(`${CONNECTION_URL}/orders`,{withCredentials:true})
    return res.data
})

export const createOrder:any=async(data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/order`,data,{withCredentials:true})
    return res.data
}
export const getOneOrderById:any=async(id:any)=>{
    let res = await axios.get(`${CONNECTION_URL}/order/${id}`,{withCredentials:true})
    return res.data
}
// export const removeItemsFromCart:any=async(id:any)=>{
//     let res = await axios.delete(`${CONNECTION_URL}/cart/${id}`,{withCredentials:true})
//     return res.data
// }
// export const fetchCountries:any = async()=>{
//     let res = await axios.get(`https://countriesnow.space/api/v0.1/countries/states`)
//     return res.data
// }
// export const fetchCities:any = async(data:any)=>{
//     let res = await axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`,data)
//     return res.data
// }
// export const fetchPinCodeByCity:any = async(cityName:any)=>{
//     let res = await axios.get(`https://api.postalpincode.in/postoffice/${cityName}`)
//     return res.data
// }


