import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productAPI } from "./api/productAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]:productAPI.reducer,
        [orderApi.reducerPath]:orderApi.reducer,
        [dashboardApi.reducerPath]:dashboardApi.reducer,
        [userReducer.name]:userReducer.reducer,
        [cartReducer.name]:cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            userAPI.middleware,
            productAPI.middleware,
            orderApi.middleware,
            dashboardApi.middleware
            );
    },
});

// Setup listeners to automatically handle caching and refetching
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>
