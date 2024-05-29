import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'

interface InitialState {
    isConnected: boolean;
}

const initialState: InitialState = {
    isConnected: false,
}

export const slice = createSlice({
    name: 'socketIO',
    initialState,
    reducers: {
        onConnectSocket: (state: InitialState) => {
            state.isConnected = true; 
        },
        onDisconnectSocket: (state: InitialState) => {
            state.isConnected = false; 
        },
    }
})

export default slice.reducer;

export const {onConnectSocket, onDisconnectSocket} = slice.actions;
export const selectSocketIO = (state: RootState) => state.socketIO;