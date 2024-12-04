// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import formsReducer from "./slices/FormsSlice";

const store = configureStore({
  reducer: {
    forms: formsReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
