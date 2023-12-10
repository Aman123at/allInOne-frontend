import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders } from "../ApiCalls/orderApis";
// import { getAllCartItems } from "../ApiCalls/cartApis";

import { RootState } from "../store";




const initialState = {
 
  orders: {status:'idle',data:[]} as any,
  
};



export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    

    // clearCart:(state)=>{
    //   state.cart.status = 'finished'
    //   state.cart.data = []
    // }
 
    // setSelectedPlan: (state, action: PayloadAction<ISelectedPlan>) => {
    //   state.selectedPlan = action.payload;
    //   state.selectedPlan.actualPlanVersion = action.payload.plan.version;
    // },
   
  },

  
  extraReducers: (builder) => {
    

    
    builder.addCase(getAllOrders.pending, (state) => {
      state.orders.status = "loading";
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.orders.status = "finished";
    
      state.orders.data = action.payload;
    });
    builder.addCase(getAllOrders.rejected, (state) => {
      state.orders.status = "error";
      state.orders.data = [];
    });
  
  },
});

// export const {
//   clearCart
// } = cartSlice.actions;

export const getOrdersFromState = (state: RootState) => state.orders.orders;



export default ordersSlice.reducer;
