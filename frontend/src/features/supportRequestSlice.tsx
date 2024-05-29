import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ResponseCreateSupportData, supportRequestApi } from "../store/services/supportRequest";

interface InitialState {
    data: ResponseCreateSupportData[] | null
}

const initialState: InitialState = {
    data: null,
}

export const slice = createSlice({
    name: 'supportRequest',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(supportRequestApi.endpoints.getSupportRequestClient.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.getSupportRequestManager.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectUsers = (state: RootState) => state.supportRequest.data;