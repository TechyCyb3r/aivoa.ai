import { configureStore } from "@reduxjs/toolkit";
import hcpReducer from "./hcpSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    hcp: hcpReducer,
    chat: chatReducer,
  },
});