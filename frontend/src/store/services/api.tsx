import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.token || localStorage.getItem('access_token');
        if (token && token !== null) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    },
})

export const BaseQueryWithRetry = retry(baseQuery, {maxRetries: 1})
