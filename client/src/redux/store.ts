import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice"
import {
    persistStore, persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import sessionStorage from "redux-persist/es/storage/session";

const persistConfig = {
    key: 'root',
    storage: sessionStorage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)
const persistedChatReducer = persistReducer(persistConfig, chatReducer)

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        chat: persistedChatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

export default store;