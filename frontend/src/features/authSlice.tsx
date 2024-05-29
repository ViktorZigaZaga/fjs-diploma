import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { ResponseLoginData, authApi } from "../store/services/auth";

interface InitialState {
    user: (ResponseLoginData) | null,
    isAuthenticated: boolean,
    token: string,
    userRoleId: {
        _id: string,
        role: string
    }
}

const initialState: InitialState = {
    user: null,
    isAuthenticated: false,
    token: '',
    userRoleId: {
        _id: '',
        role: ''
    }
}

function decodeJwt(token: string) {
    var base64Payload = token.split(".")[1];
    var payload = decodeURIComponent(
      atob(base64Payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(payload);
}

export const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.userRoleId = decodeJwt(action.payload.token);
            })
            .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
                const token = localStorage.getItem('access_token');
                if(token) {
                    state.token = token;
                    state.userRoleId = decodeJwt(token);
                    state.user = action.payload;
                    state.isAuthenticated = true;
                }
            })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUserRoleId = (state: RootState) => state.auth.userRoleId;