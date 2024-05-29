import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    UseGuards } from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { roleEnum } from "src/enums/roleEnum";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ID } from "src/interfaces/ID.types";
import { HotelsService } from "./hotels.service";
import { SearchHotelParams } from "src/interfaces/hotel/SearchHotelParams.interface";
import { UpdateHotelParams } from "src/interfaces/hotel/UpdateHotelParams.interface";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { HotelDtoValidate } from "./dto/Hotel.dto.validate";
import { HotelDocument } from "src/schemas/hotel.schema";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(roleEnum.admin)
@Controller('api')
export class HotelsController {
    constructor(private hotelsService: HotelsService) {}

    @Post('/admin/hotels/')
    async createHotel(
        @Body(DtoValidationPipe) hotelDtoValidate: HotelDtoValidate
    ) {
        const hotel = await this.hotelsService.create(hotelDtoValidate);
        return { 
            id: hotel._id, 
            title: hotel.title, 
            description: hotel.description,
        };
    }

    @Get('/admin/hotels/')
    async getHotelsAdmin(
        @Query() searchHotelParams: SearchHotelParams
    ): Promise<{hotels: HotelDocument[], totalCount: number}> {
        const hotels = await this.hotelsService.search(searchHotelParams);
        const totalCount = await this.hotelsService.getTotalCount(searchHotelParams);
        return {hotels, totalCount};
    }

    @Put('/admin/hotels/:id')
    async updateHotel(
        @Param('id') id: ID, 
        @Body() updateHotelParams: UpdateHotelParams,
    ){
        return await this.hotelsService.update(id, updateHotelParams)
    }
}
