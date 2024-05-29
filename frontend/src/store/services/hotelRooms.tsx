import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { HotelData } from "../../types/interfaces";

export type RequestCreateHotelRoomData = {
    data: FormData,
}
FormData;

export type RequestUpdateHotelRoomData = {
    _id: string,
    data: FormData,
}

export type ResponseHotelData = Omit<HotelData, "limit" | "offset">

export interface ResponseGetRoomData {
    id: string,
    description: string,
    images: string[],
    hotel: {
        _id: string,
        title: string,
        description: string,
    }
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
        getListRooms: builder.query<ResponseGetRoomData[], RequestGetListRoomsData>({
            query: (params) => ({
                url: '/common/hotel-rooms/',
                method: 'GET',
                params
            }),
            providesTags: ['HotelRoom']
        }), 
        createRoomAdmin: builder.mutation<ResponseChangeHotelRoomData, RequestCreateHotelRoomData>({
            query: ({data}) => ({
                url: `/admin/hotel-rooms/`,
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                data
            }),
            invalidatesTags: ['HotelRoom']
        }),
        updateRoomAdmin: builder.mutation<ResponseChangeHotelRoomData, RequestUpdateHotelRoomData>({
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

