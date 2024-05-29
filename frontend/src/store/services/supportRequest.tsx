import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { MessageData, SupportRequestData, UserData } from "../../types/interfaces";

export type CreateRequestData = {
    user: string,
    text: string
}
export type RequestAddSupportData = {
    author: string,
    supportRequest: string,
    text: string;
}
export type ResponseCreateSupportData = Omit<SupportRequestData,  "messages" | "user" | "limit" | "offset"> & {hasNewMessages: boolean}

export type RequestGetListSupportData = Omit<SupportRequestData,  "messages" | "_id" | "createdAt">

export type GetAllMessageA = Omit<SupportRequestData,  "messages" | "user" | "limit" | "offset" | "isActive">
export type GetAllMessageB = Omit<MessageData, "_id" | "author" | "sentAt">
export type GetAllMessageC = Omit<UserData, "email" | "contactPhone" | "password" | "role" | "limit" | "offset" | "token">
export type ResponseGetMessage = GetAllMessageB & GetAllMessageA & {author: GetAllMessageC};

export type RequestMarkReadData = { createdBefore: string }

export type ResponseMarkReadData = {   
    success: boolean, 
    error?: unknown 
}





export const supportRequestApi = createApi({
    reducerPath: 'supportRequestApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    tagTypes: ['SupportRequest'],
    endpoints: (builder) => ({
        getSupportRequestClient: builder.query<ResponseCreateSupportData[], RequestGetListSupportData>({
            query: (params) => ({
                url: '/client/support-requests',
                method: 'GET',  
                params
            }),
            providesTags: ['SupportRequest'],
        }),
        getSupportRequestManager: builder.query<ResponseCreateSupportData[], RequestGetListSupportData>({
            query: (params) => ({
                url: '/manager/support-requests',
                method: 'GET',
                params
            }),
            providesTags: ['SupportRequest'],
        }),
        getAllMessageByIdSupport: builder.query<ResponseGetMessage[], string>({
            query: (id) => ({
                url: `/common/support-requests/${id}/messages`,
                method: 'GET',
            }),
            providesTags: ['SupportRequest'],
        }),
        createSupportRequest: builder.mutation<ResponseCreateSupportData, CreateRequestData>({
            query: (body) => ({
                url: '/client/support-requests',
                method: 'POST',
                body
            }),
            invalidatesTags: ['SupportRequest'],
        }),
        sendMessages: builder.mutation<ResponseGetMessage, RequestAddSupportData>({
            query: (body) => ({
                url: `/common/support-requests/${body.supportRequest}/messages`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['SupportRequest'],
        }),
        markMessagesAsRead: builder.mutation<ResponseMarkReadData, RequestMarkReadData>({
            query: (id, ...body) => ({
                url: `/common/support-requests/${id}/messages/read`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['SupportRequest'],
        }),
        closeRequest: builder.mutation<void, string>({
            query: (id) => ({
                url: `/common/support-requests/close/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['SupportRequest'],
        }),
    })
})

export const { 
    useCreateSupportRequestMutation,
    useSendMessagesMutation,
    useMarkMessagesAsReadMutation,
    useCloseRequestMutation,
    useGetSupportRequestClientQuery,
    useGetSupportRequestManagerQuery,
    useGetAllMessageByIdSupportQuery 
} = supportRequestApi;
export const {endpoints: { 
    createSupportRequest, 
    sendMessages,
    markMessagesAsRead,
    closeRequest,
    getSupportRequestClient,
    getSupportRequestManager,
    getAllMessageByIdSupport 
}} = supportRequestApi;
