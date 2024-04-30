import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { 
    ReservationsListData, 
    ResponseGetListReservationsData, 
    reservationsApi 
} from "../store/services/reservations";

interface InitialState {
    data: (ResponseGetListReservationsData | ReservationsListData) | null
}

const initialState: InitialState = {
    data: null,
}

export const slice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(reservationsApi.endpoints.createReservationClient.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(reservationsApi.endpoints.getListReservationsClient.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(reservationsApi.endpoints.getListReservationsManager.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            // .addMatcher(reservationsApi.endpoints.deleteReservationClient.matchFulfilled, (state, action) => {
            //     state.data = action.payload;
            // })
            // .addMatcher(reservationsApi.endpoints.deleteReservationClient.matchFulfilled, (state, action) => {
            //     state.data = action.payload;
            // })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectReservations = (state: RootState) => state.reservations.data;