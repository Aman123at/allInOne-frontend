import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCartItems } from "../ApiCalls/cartApis";
import { fetchSavedAddresses } from "../ApiCalls/checkoutApis";

import { RootState } from "../store";




const initialState = {
 
  address: {status:'idle',data:{}} as any,
  
};



export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    

  
 
    setAddress: (state, action: any) => {
        console.log("Set Address Payload",action.payload)
     if(state.address.data.address ){
        state.address.data.address = [...state.address.data.address,action.payload]
     }else{

         state.address.data.address=[action.payload]
     }
    },

    deleteAddress:(state,action:any)=>{
        let dataArr:any = state.address.data.address
        state.address.data.address = dataArr.filter((val:any)=>val._id !== action.payload)
    }
   
  },

  
  extraReducers: (builder) => {
    

    
    builder.addCase(fetchSavedAddresses.pending, (state) => {
      state.address.status = "loading";
    });
    builder.addCase(fetchSavedAddresses.fulfilled, (state, action) => {
      state.address.status = "finished";
      console.log("ACTION payload",action.payload)
        let modifiedData:any = []
        action.payload.address.map((val:any)=>{
            let obj = {...val,temp:false}
            modifiedData.push(obj)
        })
      state.address.data = {success:action.payload.success,address:modifiedData};
    });
    builder.addCase(fetchSavedAddresses.rejected, (state) => {
      state.address.status = "error";
      state.address.data = {};
    });
  
  },
});

export const {
//   setUserInfo,
//   setSelectedPlan,
//   setActionPlansPromisesList,
//   clearPlanSummary,
//   setDoNotPushPlans,
//   setSelectedUnit,
//   updateSimulationVersion,
//   setCurrentUserProfile,
//   setPlanSummary,
//   updateTooltipSettings,
//   updatePlanSummary2,
//   setIsAOPPlan,
//   updateSelectedPlan,
  deleteAddress,
  setAddress
} = checkoutSlice.actions;

export const getSavedAddresses = (state: RootState) => state.checkout.address;



export default checkoutSlice.reducer;
