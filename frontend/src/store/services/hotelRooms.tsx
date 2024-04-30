import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { HotelRoomData, HotelData } from "../../types/interfaces";

export type RequestCreateHotelRoomData = FormData
// Omit<HotelRoomData, "_id" | "createdAt" | "updatedAt" | "isEnabled">;

export interface ResponseGetRoomData {
    id: string,
    description: string,
    images: string[],
    hotel: HotelData
}

export interface ResponseGetListRoomsData {
    hotelRooms: ResponseGetRoomData[],
    totalCount: number
}

export interface RequestGetListRoomsData {
    limit: number,
    offset: number,
    hotel: string
}

export interface ResponseChangeHotelRoomData {
    id: string,
    description: string,
    images: string[],
    isEnabled: boolean,
    hotel: HotelData
}

export const hotelRoomsApi = createApi({
    reducerPath: 'hotelRoomsApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    tagTypes: ['HotelRoom'],
    endpoints: (builder) => ({
        getRoom: builder.query<ResponseGetRoomData, string>({
            query: (id) => ({
                url: `/common/hotel-rooms/${id}`,
                method: 'GET',        
            }),
            providesTags: ['HotelRoom']
        }),
        getListRooms: builder.query<ResponseGetListRoomsData, RequestGetListRoomsData>({
            query: (params) => ({
                url: '/common/hotel-rooms/',
                method: 'GET',
                params
            }),
            transformResponse(response: ResponseGetRoomData[], meta: any) {
                return { 
                    hotelRooms: response, 
                    totalCount: Number(meta?.response?.headers.get('X-Total-Count')),
                }
            },
            providesTags: ['HotelRoom']
        }), 
        createRoomAdmin: builder.mutation<ResponseChangeHotelRoomData, RequestCreateHotelRoomData>({
            query: (body) => ({
                url: `/admin/hotel-rooms/`,
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body
            }),
            invalidatesTags: ['HotelRoom']
        }),
        updateRoomAdmin: builder.mutation<ResponseChangeHotelRoomData, HotelRoomData>({
            query: ({_id, ...body}) => ({
                url: `/admin/hotel-rooms/${_id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'multipart/form-data' },
                body
            }),
            invalidatesTags: ['HotelRoom']
        }),
    })
})

export const { useCreateRoomAdminMutation, useUpdateRoomAdminMutation, useGetRoomQuery, useGetListRoomsQuery } = hotelRoomsApi;
export const {endpoints: {createRoomAdmin, updateRoomAdmin, getRoom, getListRooms}} = hotelRoomsApi;

