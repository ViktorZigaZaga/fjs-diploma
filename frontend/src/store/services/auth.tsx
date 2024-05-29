import { createApi } from "@reduxjs/toolkit/query/react";
import { UserData } from "../../types/interfaces";
import { BaseQueryWithRetry } from "./api";

export type RequestLoginData = Omit<UserData, "_id" | "role" | "name" | "contactPhone" | "limit" | "offset" | "token">
export type ResponseLoginData = Omit<UserData, "_id" | "role" | "password" | "limit" | "offset">

export type RequestRegData = Omit<UserData, "_id" | "role" | "limit" | "offset" | "token">
export type ResponseRegData = Omit<UserData, "contactPhone" | "role" | "password" | "limit" | "offset" | "token">

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        login: builder.mutation<ResponseLoginData, RequestLoginData>({
            query: (loginData) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData,
            })
        }),
        register: builder.mutation<ResponseRegData, RequestRegData>({
            query: (regData) => ({
                url: '/client/register',
                method: 'POST',
                body: regData,
            })
        }),
        getCurrentUser: builder.query<ResponseLoginData, void>({
            query: () => ({
              url: '/auth/currentUser',
              method: 'GET',
            }),
            transformResponse: (response: any) => {
              return response;
            }
        }),
    })
})

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
export const { endpoints: {login, register, getCurrentUser} } = authApi;