import { createListenerMiddleware } from '@reduxjs/toolkit';
import { authApi } from '../store/services/auth';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners();
        if (action.payload.token) {
            localStorage.setItem('access_token', action.payload.token);
        }
    }
})