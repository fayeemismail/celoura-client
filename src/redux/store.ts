import { configureStore } from "@reduxjs/toolkit";
import persistedUserReducer from './reducer/persistReducer'
import { persistStore } from "redux-persist";


export const store = configureStore({
    reducer: {
        user: persistedUserReducer
    }, 
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;