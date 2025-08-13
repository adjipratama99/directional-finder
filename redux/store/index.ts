import { configureStore } from "@reduxjs/toolkit";
import wilayahReducer from '@/redux/slices/wilayahSlice'

export const store = configureStore({
    reducer: {
        wilayah: wilayahReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
