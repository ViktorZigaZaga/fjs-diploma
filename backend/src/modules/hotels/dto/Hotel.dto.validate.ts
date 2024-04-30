import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray } from "class-validator";
import { Hotel } from "src/schemas/hotel.schema";

export class HotelDtoValidate extends Hotel {
    @IsNotEmpty() @IsString() @MinLength(5)
    title: string;
  
    @IsOptional() @IsString() @MinLength(100)
    description: string;
}