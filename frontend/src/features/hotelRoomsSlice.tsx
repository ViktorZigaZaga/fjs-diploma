import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { 
    ResponseChangeHotelRoomData, 
    ResponseGetListRoomsData, 
    ResponseGetRoomData, 
    hotelRoomsApi 
} from "../store/services/hotelRooms";

interface InitialState {
    data: (ResponseGetRoomData | ResponseGetListRoomsData | ResponseChangeHotelRoomData) | null,
}

const initialState: InitialState = {
    data: null,
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
                state.data = action.payload;
            })
            .addMatcher(hotelRoomsApi.endpoints.getRoom.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(hotelRoomsApi.endpoints.updateRoomAdmin.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(hotelRoomsApi.endpoints.createRoomAdmin.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectHotelRooms = (state: RootState) => state.hotelRooms.data;