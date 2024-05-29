import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryWithRetry } from "./api";
import { HotelData, HotelRoomData, ReservationData } from "../../types/interfaces";

export type RequestCreateReservationsData = Omit<ReservationData, "_id">

export type ResponseHotelRoomReservation = Omit<HotelRoomData, "_id" | "isEnabled" | "hotelId">
export type ResponseHotelReservation = Omit<HotelData, "_id" | "limit" | "offset">
export interface ReservationsListData{
    dateStart: string,
    dateEnd: string,
    hotelRoom: ResponseHotelRoomReservation,
    hotelId: ResponseHotelReservation,
    _id: string
}

export type RequestGetListReservationsClientData = Omit<ReservationData, "_id" | "roomId" | "hotelId">;

export const reservationsApi = createApi({
    reducerPath: 'reservationsApi',
    baseQuery: BaseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    tagTypes: ['Reservation'],
    endpoints: (builder) => ({
        getListReservationsClient: builder
            .query<ReservationsListData[], RequestGetListReservationsClientData>({
                query: (params) => ({
                    url: '/client/reservations',
                    method: 'GET',  
                    params      
                }),
                providesTags: ['Reservation'],
            }),
        getListReservationsManager: builder
            .query<ReservationsListData[], string>({
                query: (userId) => ({
                    url: `/manager/reservations/${userId}`,
                    method: 'GET',
                }),
                providesTags: ['Reservation'],
            }),
        createReservationClient: builder
            .mutation<ReservationsListData, RequestCreateReservationsData>({
                query: (body) => ({
                    url: '/client/reservations',
                    method: 'POST',
                    body
                }),
                invalidatesTags: ['Reservation'],
            }),
        deleteReservationManager: builder.mutation<void, string>({
            query: (id) => ({
                url: `/manager/reservations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reservation'],
        }),
        deleteReservationClient: builder.mutation<void, string>({
            query: (id) => ({
                url: `/client/reservations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reservation'],
        }),
    })
})

export const { 
    useCreateReservationClientMutation, 
    useGetListReservationsClientQuery, 
    useGetListReservationsManagerQuery,
    useDeleteReservationClientMutation,
    useDeleteReservationManagerMutation
} = reservationsApi;
export const {endpoints: { 
    createReservationClient,
    getListReservationsClient,
    getListReservationsManager,
    deleteReservationClient,
    deleteReservationManager
}} = reservationsApi;
