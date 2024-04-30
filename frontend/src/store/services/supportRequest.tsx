import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { MessageData, SupportRequestData, UserData } from "../../types/interfaces";

export type RequestCreateSupportData = Omit<MessageData, "_id" | "author" | "sentAt" | "readAt">
export type RequestAddSupportData = Omit<MessageData, "_id" | "author" | "sentAt" | "readAt">
export type ResponseCreateSupportData = Omit<SupportRequestData,  "messages" | "user" | "limit" | "offset"> & {hasNewMessages: boolean}

export type RequestGetListSupportData = Omit<SupportRequestData,  "messages" | "user" | "_id" | "createdAt">
export interface ResponseGetListSupportData {
    supports: ResponseCreateSupportData[],
    totalCount: number
}

export type GetAllMessageA = Omit<SupportRequestData,  "messages" | "user" | "limit" | "offset" | "isActive">
export type GetAllMessageB = Omit<MessageData, "_id" | "author" | "sentAt">
export type GetAllMessageC = Omit<UserData, "email" | "contactPhone" | "password" | "role" | "limit" | "offset">
export type ResponseGetMessage = GetAllMessageA & GetAllMessageB & {author: GetAllMessageC};
export interface ResponseGetListAllMessage {
    supports: ResponseGetMessage[],
    totalCount: number
}

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
        getSupportRequestClient: builder.query<ResponseGetListSupportData, RequestGetListSupportData>({
            query: (params) => ({
                url: '/client/support-requests',
                method: 'GET',  
                params
            }),
            transformResponse(response: ResponseCreateSupportData[], meta: any) {
                return { 
                    supports: response, 
                    totalCount: Number(meta?.response?.headers.get('X-Total-Count')),
                }
            },
            providesTags: ['SupportRequest'],
        }),
        getSupportRequestManager: builder.query<ResponseGetListSupportData, RequestGetListSupportData>({
            query: (params) => ({
                url: '/manager/support-requests',
                method: 'GET',
                params
            }),
            transformResponse(response: ResponseCreateSupportData[], meta: any) {
                return { 
                    supports: response, 
                    totalCount: Number(meta?.response?.headers.get('X-Total-Count'))
                }
            },
            providesTags: ['SupportRequest'],
        }),
        getAllMessageByIdSupport: builder.query<ResponseGetListAllMessage, string>({
            query: (id) => ({
                url: `/common/support-requests/${id}/messages`,
                method: 'GET',
            }),
            transformResponse(response: ResponseGetMessage[], meta: any) {
                return { 
                    supports: response, 
                    totalCount: Number(meta?.response?.headers.get('X-Total-Count'))
                }
            },
            providesTags: ['SupportRequest'],
        }),
        createSupportRequest: builder.mutation<ResponseCreateSupportData, ResponseCreateSupportData>({
            query: (body) => ({
                url: '/client/support-requests',
                method: 'POST',
                body
            }),
            invalidatesTags: ['SupportRequest'],
        }),
        sendMessages: builder.mutation<ResponseGetMessage, RequestAddSupportData>({
            query: (id, ...body) => ({
                url: `/common/support-requests/${id}/messages`,
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
