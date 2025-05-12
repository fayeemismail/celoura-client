import { configureStore } from "@reduxjs/toolkit";
import persistedUserReducer from './reducer/persistReducer'
import { persistStore } from "redux-persist";
import persistedAdminReducer from "./reducer/persistAdminReducer";
import persistGuideReducer from "./reducer/persistGuideReducer";


export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        admin: persistedAdminReducer,
        guide: persistGuideReducer,
    }, 
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;