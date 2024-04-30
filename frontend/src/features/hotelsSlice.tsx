import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ResponseGetListHotelsData, hotelsApi } from "../store/services/hotels";

interface InitialState {
    hotels: ResponseGetListHotelsData | null,
}

const initialState: InitialState = {
    hotels: null,
}

export const slice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(hotelsApi.endpoints.getListHotelsAdmin.matchFulfilled, (state, action) => {
                state.hotels = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectHotels = (state: RootState) => state.hotels;