import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts } from "../ApiCalls/productApis";


import { RootState } from "../store";




const initialState = {
 
  products: {status:'idle',data:[]} as any,
  bulkAddData:[] as any
  
};



export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    

  
 
    setBulkAddData: (state, {payload}) => {
    
      state.bulkAddData = payload;
      
    },

    updateBulkAddData:(state,{payload})=>{
      state.bulkAddData = state.bulkAddData.map((value:any)=>{
        if(value.Name === payload.productName){
          value.images.push(payload.file)
          value.imagesForPreview.push(payload.preview)
          return value
        }else{
          return value
        }
      })
    },
    removeImages:(state,{payload})=>{
      state.bulkAddData = state.bulkAddData.map((value:any)=>{
        if(value.Name === payload.productName){
          value.images = value.images.filter((val:any,i:number)=>i!==payload.index)
          value.imagesForPreview =value.imagesForPreview.filter((val:any,i:number)=>i!==payload.index)
          return value
        }else{
          return value
        }
      })
    }
   
  },
extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
        state.products.status = "loading";
      });
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.status = "finished";
      
        state.products.data = action.payload;
      });
      builder.addCase(fetchProducts.rejected, (state) => {
        state.products.status = "error";
        state.products.data = [];
      });
}
})
export const {
 setBulkAddData,updateBulkAddData,removeImages
} = productSlice.actions;

export const getAllProducts = (state: any) => state.product.products;
export const getAllBulkAddData = (state: any) => state.product.bulkAddData;



export default productSlice.reducer;
