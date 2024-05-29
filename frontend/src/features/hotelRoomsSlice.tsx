import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ResponseGetRoomData, hotelRoomsApi } from "../store/services/hotelRooms";

interface InitialState {
    rooms: ResponseGetRoomData[] | null,
}

const initialState: InitialState = {
    rooms: null,
}

export const slice = createSlice({
    name: 'hotelRooms',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(hotelRoomsApi.endpoints.getListRooms.matchFulfilled, (state, action) => {
                state.rooms = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectHotelRooms = (state: RootState) => state.hotelRooms.rooms;