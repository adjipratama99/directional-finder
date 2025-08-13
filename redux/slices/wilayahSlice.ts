import { createSlice } from "@reduxjs/toolkit";

interface WilayahState {
    wilayah: { value: string; text: string }[]
    nama_satuan: { value: string; text: string }[]
}

const initialState: WilayahState = {
    wilayah: [],
    nama_satuan: []
}

export const wilayahSlice = createSlice({
    name: "wilayah",
    initialState,
    reducers: {
        addWilayah: (state, action) => {
            state.wilayah = action.payload
        },
        addNamaSatuan: (state, action) => {
            state.nama_satuan = action.payload
        }
    }
})

export const {
    addWilayah,
    addNamaSatuan
} = wilayahSlice.actions

export default wilayahSlice.reducer