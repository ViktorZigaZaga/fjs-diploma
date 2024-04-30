import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ResponseGetListUsersData, usersApi } from "../store/services/users";

interface InitialState {
    users: ResponseGetListUsersData | null,
}

const initialState: InitialState = {
    users: null,
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(usersApi.endpoints.getListUsersAdmin.matchFulfilled, (state, action) => {
                state.users = action.payload;
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectUsers = (state: RootState) => state.users;