import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "../ApiCalls/userApis";


import { RootState } from "../store";




const initialState = {
 
  user: {status:'idle',data:[]} as any,

  
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
  extraReducers:(builder)=>{
    builder.addCase(fetchUser.pending, (state) => {
      state.user.status = "loading";
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user.status = "finished";
    
      state.user.data = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.user.status = "error";
      state.user.data = [];
    });
  }
})
export const {
    clearUser,
 setUser
} = userSlice.actions;

export const getLoggedInUser = (state: RootState) => state.user.user;



export default userSlice.reducer;
