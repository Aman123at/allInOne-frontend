import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { CONNECTION_URL } from '../config/ApiConfig'
export const fetchProducts:any =
createAsyncThunk(
    'fetchProducts',
async()=>{
    let res = await axios.get(`${CONNECTION_URL}/products`)
    return res.data
})



export const getOneProductById:any = async(id:any)=>{
    let res = await axios.get(`${CONNECTION_URL}/product/${id}`)
    return res.data
}
export const addProduct:any = async(data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/admin/product/add`,data,{withCredentials:true})
    return res.data
}

export const deleteProduct:any = async(id:any)=>{
    let res = await axios.delete(`${CONNECTION_URL}/product/${id}`,{withCredentials:true})
    return res.data
}
export const removeProductImage:any = async(id:any,data:any)=>{
    let res = await axios.post(`${CONNECTION_URL}/admin/images/remove/${id}`,data,{withCredentials:true})
    return res.data
}
export const updateProduct:any = async(id:any,data:any)=>{
    let res = await axios.put(`${CONNECTION_URL}/admin/product/update/${id}`,data,{withCredentials:true})
    return res.data
}
export const getAreaByPinCode:any = async(code:any)=>{
    let res = await axios.get(`https://api.postalpincode.in/pincode/${code}`)
    return res.data
}
// export const logout =async()=>{
//     let res = await axios.get(`${CONNECTION_URL}/logout`,{withCredentials:true})
//     return res.data
// }