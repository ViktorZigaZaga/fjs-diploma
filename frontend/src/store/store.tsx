import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "../middlewares/auth";
import auth from "../features/authSlice";
import users from "../features/usersSlice";
import hotels from "../features/hotelsSlice";
import hotelRooms from "../features/hotelRoomsSlice";
import reservations from "../features/reservationsSlice";
import supportRequest from "../features/supportRequestSlice";
import { authApi } from "./services/auth";
import { usersApi } from "./services/users";
import { hotelsApi } from "./services/hotels";
import { hotelRoomsApi } from "./services/hotelRooms";
import { reservationsApi } from "./services/reservations";
import { supportRequestApi } from "./services/supportRequest";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [hotelsApi.reducerPath]: hotelsApi.reducer,
        [hotelRoomsApi.reducerPath]: hotelRoomsApi.reducer,
        [reservationsApi.reducerPath]: reservationsApi.reducer,
        [supportRequestApi.reducerPath]: supportRequestApi.reducer,
        auth,
        users,
        hotels,
        hotelRooms,
        reservations,
        supportRequest,
        // socketIO: socketIOReducer,
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(
            authApi.middleware,
            usersApi.middleware,
            hotelsApi.middleware,
            hotelRoomsApi.middleware,
            reservationsApi.middleware,
            supportRequestApi.middleware,
        )
        .prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

