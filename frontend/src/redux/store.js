import { configureStore } from "@reduxjs/toolkit";
import { Api } from "./api/api";
import authReducer from "./apiSlice";

export const store = configureStore({
    reducer: {
        [Api.reducerPath]: Api.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(Api.middleware)
})