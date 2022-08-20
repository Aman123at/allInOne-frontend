import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllCategory } from "../ApiCalls/categoryApis";
import { RootState } from "../store";




const initialState = {
 
  category: {status:'idle',data:[]} as any,
  
};



export const userProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    

  
 
    // setSelectedPlan: (state, action: PayloadAction<ISelectedPlan>) => {
    //   state.selectedPlan = action.payload;
    //   state.selectedPlan.actualPlanVersion = action.payload.plan.version;
    // },
   
  },

  
  extraReducers: (builder) => {
    

    
    builder.addCase(getAllCategory.pending, (state) => {
      state.category.status = "loading";
    });
    builder.addCase(getAllCategory.fulfilled, (state, action) => {
      state.category.status = "finished";
    
      state.category.data = action.payload;
    });
    builder.addCase(getAllCategory.rejected, (state) => {
      state.category.status = "error";
      state.category.data = [];
    });
  
  },
});

// export const {
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
//   setLoaderForActionPlan,
//   updatePlanSummary2OnCreatePlan
// } = userProfileSlice.actions;

export const getAllCategories = (state: RootState) => state.category.category;



export default userProfileSlice.reducer;
