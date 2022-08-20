import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


import { RootState } from "../store";




const initialState = {
 
  loader: false as Boolean,
  deleteModalOpen:false as Boolean,
  
};



export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    

  
 
    setLoader: (state, {payload}) => {
      state.loader = payload;
      
    },

    setDeleteModal:(state,{payload})=>{
      state.deleteModalOpen = payload;
    }
   
  },
})
export const {
 setLoader,
 setDeleteModal
} = commonSlice.actions;

export const getLoader = (state: RootState) => state.common.loader;
export const getDeleteModalState = (state: RootState) => state.common.deleteModalOpen;



export default commonSlice.reducer;
