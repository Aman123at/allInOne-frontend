import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import categoryReducer from './slices/categorySlice';
import commonReducer from './slices/commonSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';


export const store = configureStore({
  reducer: {
    category: categoryReducer,
    common:commonReducer,
    product:productReducer,
    user:userReducer
   
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

