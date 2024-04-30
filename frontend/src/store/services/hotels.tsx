import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { HotelData } from "../../types/interfaces";

export type RequestCreateHotelData = Omit<HotelData, "_id" | "limit" | "offset">;

export type RequestGetListHotelsData = Omit<HotelData, "_id" | "description">;
export type ResponseHotelsData = Omit<HotelData, "limit" | "offset">;
export interface ResponseGetListHotelsData {
    hotels: ResponseHotelsData[],
    totalCount: number
}

export const hotelsApi = createApi({
    reducerPath: 'hotelsApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    tagTypes: ['Hotel'],
    endpoints: (builder) => ({
        getListHotelsAdmin: builder.query<ResponseGetListHotelsData, RequestGetListHotelsData>({
            query: (seachHotels) => ({
                url: '/admin/hotels/',
                method: 'GET',    
                params: seachHotels
            }),
            providesTags: ['Hotel']
        }),
        createHotelAdmin: builder.mutation<ResponseHotelsData, RequestCreateHotelData>({
            query: (body) => ({
                url: '/admin/hotels/',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Hotel']
        }), 
        updateHotelAdmin: builder.mutation<ResponseHotelsData, ResponseHotelsData>({
            query: ({_id, ...body}) => ({
                url: `/admin/hotels/${_id}`,
                method: 'PUT',
                // headers: { 'Content-Type': 'multipart/form-data' },
                body
            }),
            invalidatesTags: ['Hotel']
        }),
    })
})

export const { useGetListHotelsAdminQuery, useCreateHotelAdminMutation, useUpdateHotelAdminMutation } = hotelsApi;
export const {endpoints: {createHotelAdmin, updateHotelAdmin, getListHotelsAdmin}} = hotelsApi;
