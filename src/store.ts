import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import categoryReducer from './slices/categorySlice';
import cartReducer from './slices/cartSlice';
import commonReducer from './slices/commonSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import checkoutReducer from './slices/checkoutSlice';


export const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart: cartReducer,
    common:commonReducer,
    product:productReducer,
    user:userReducer,
    checkout:checkoutReducer
   
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

