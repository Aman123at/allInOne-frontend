import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


import { RootState } from "../store";




const initialState = {
 
  user: null as any,

  
};



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    

    clearUser:(state => state = initialState),
 
    setUser: (state, {payload}) => {
      state.user = payload;
      
    },

  
   
  },
})
export const {
    clearUser,
 setUser
} = userSlice.actions;

export const getLoggedInUser = (state: RootState) => state.user.user;



export default userSlice.reducer;
