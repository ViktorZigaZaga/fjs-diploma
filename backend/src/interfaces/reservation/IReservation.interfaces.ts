import { ObjectId } from "mongoose";

export interface IReservation {
    userId: ObjectId;
    hotelId: ObjectId;
    roomId: ObjectId;
    dateStart: Date;
    dateEnd: Date;
}