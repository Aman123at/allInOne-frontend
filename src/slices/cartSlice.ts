import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCartItems } from "../ApiCalls/cartApis";

import { RootState } from "../store";




const initialState = {
 
  cart: {status:'idle',data:[]} as any,
  
};



export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    

    clearCart:(state)=>{
      state.cart.status = 'finished'
      state.cart.data = []
    }
 
    // setSelectedPlan: (state, action: PayloadAction<ISelectedPlan>) => {
    //   state.selectedPlan = action.payload;
    //   state.selectedPlan.actualPlanVersion = action.payload.plan.version;
    // },
   
  },

  
  extraReducers: (builder) => {
    

    
    builder.addCase(getAllCartItems.pending, (state) => {
      state.cart.status = "loading";
    });
    builder.addCase(getAllCartItems.fulfilled, (state, action) => {
      state.cart.status = "finished";
    
      state.cart.data = action.payload;
    });
    builder.addCase(getAllCartItems.rejected, (state) => {
      state.cart.status = "error";
      state.cart.data = [];
    });
  
  },
});

export const {
  clearCart
} = cartSlice.actions;

export const getCartItems = (state: RootState) => state.cart.cart;



export default cartSlice.reducer;
