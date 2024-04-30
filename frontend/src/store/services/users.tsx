import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { UserData } from "../../types/interfaces";

export type RequestGetListUsersData = Omit<UserData, "password" | "role" | "_id" | "token">;
export type UsersListData = Omit<UserData, "password" | "role" | "limit" | "offset" | "token">;
export interface ResponseGetListUsersData{
    users: UsersListData[],
    totalCount: number,
}

export type RequestCreateUserData = Omit<UserData, "_id" | "limit" | "offset" | "token">;
export type ResponseCreateUserData = Omit<UserData, "password" | "limit" | "offset" | "token">;

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getListUsersAdmin: builder.query<ResponseGetListUsersData, RequestGetListUsersData>({
            query: (params) => ({
                url: '/admin/users/',
                method: 'GET',  
                params      
            }),
            providesTags: ['User'],
        }),
        getListUsersManager: builder.query<ResponseGetListUsersData, RequestGetListUsersData>({
            query: (params) => ({
                url: '/manager/users/',
                method: 'GET',
                params
            }),
            providesTags: ['User'],
        }),
        createUserAdmin: builder.mutation<ResponseCreateUserData, RequestCreateUserData>({
            query: (body) => ({
                url: '/admin/users',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const { useGetListUsersAdminQuery, useGetListUsersManagerQuery, useCreateUserAdminMutation } = usersApi;
export const {endpoints: {getListUsersAdmin, getListUsersManager, createUserAdmin}} = usersApi;
