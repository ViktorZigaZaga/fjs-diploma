import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ReservationsListData, reservationsApi} from "../store/services/reservations";

interface InitialState {
    reservations: ReservationsListData[] | null
}

const initialState: InitialState = {
    reservations: null,
}

export const slice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(reservationsApi.endpoints.getListReservationsClient.matchFulfilled, (state, action) => {
                state.reservations = action.payload;
            })
            .addMatcher(reservationsApi.endpoints.getListReservationsManager.matchFulfilled, (state, action) => {
                state.reservations = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectReservations = (state: RootState) => state.reservations;