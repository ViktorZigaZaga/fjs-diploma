import { IsArray, IsString, IsOptional, IsNotEmpty, IsBoolean} from "class-validator";
import { ObjectId } from "mongoose";
import { HotelRoom } from "src/schemas/hotelRoom.schema";

export class HotelRoomDtoValidate extends HotelRoom {
    @IsNotEmpty()
    hotel: ObjectId;
  
    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsArray()
    images: string[];

    @IsBoolean()
    isEnabled: boolean;
}