import { ID } from "../ID.types";
import { HotelRoom } from "src/schemas/hotelRoom.schema";
import { SearchRoomParams } from "./SearchRoomParams.interface";

export interface IHotelRoomService {
    create(data: Partial<HotelRoom>): Promise<HotelRoom>;
    findById(id: ID): Promise<HotelRoom>;
    search(params: SearchRoomParams): Promise<HotelRoom[]>;
    update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}