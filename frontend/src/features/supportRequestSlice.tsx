import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../store/store'
import { 
    ResponseCreateSupportData, 
    ResponseGetListAllMessage, 
    ResponseGetListSupportData, 
    ResponseGetMessage, 
    ResponseMarkReadData,
    supportRequestApi 
} from "../store/services/supportRequest";

interface InitialState {
    data: (ResponseCreateSupportData 
        | ResponseGetListSupportData 
        | ResponseGetListAllMessage 
        | ResponseGetMessage
        | ResponseMarkReadData
    ) | null
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
            .addMatcher(supportRequestApi.endpoints.createSupportRequest.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.sendMessages.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.markMessagesAsRead.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.getSupportRequestClient.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.getSupportRequestManager.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(supportRequestApi.endpoints.getAllMessageByIdSupport.matchFulfilled, (state, action) => {
                state.data = action.payload;
            })
            // .addMatcher(supportRequestApi.endpoints.closeRequest.matchFulfilled, (state, action) => {
            //     state.data = action.payload;
            // })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectUsers = (state: RootState) => state.users.data;