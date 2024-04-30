import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Put,
    Query, 
    Request, 
    UploadedFiles, 
    UseFilters, 
    UseGuards, 
    UseInterceptors 
} from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { roleEnum } from "src/enums/roleEnum";
// import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { ID } from "src/interfaces/ID.types";
import { HotelsService } from "../hotels/hotels.service";
import { HotelRoomsService } from "./hotel-rooms.service";
import { MulterFilesInterceptor } from 'src/interceptors/fileUpload.interception';
import { SearchRoomParams } from "src/interfaces/hotel/SearchRoomParams.interface";
import { HotelRoomDocument } from "src/schemas/hotelRoom.schema";
import { HotelDocument } from "src/schemas/hotel.schema";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { HotelRoomDtoValidate } from "./dto/HotelRoom.dto.validate";

@Controller('api')
export class HotelRoomsController {
    constructor(
        private hotelsService: HotelsService,
        private hotelRoomsService: HotelRoomsService,
    ) {}

    // @UseGuards(
    //     // JwtAuthGuard,
    //      RolesGuard
    //     )
    // @Roles(roleEnum.admin)
    @Post('/admin/hotel-rooms/')
    @UseInterceptors(MulterFilesInterceptor())
    async createRoom(
        @Body(DtoValidationPipe) hotelRoomDtoValidate: HotelRoomDtoValidate,
        @UploadedFiles() files: Array<Express.Multer.File>,
        ) {
        const hotel = await this.hotelsService.findById(hotelRoomDtoValidate.hotel);
        const data = Object.assign({}, hotelRoomDtoValidate, {
            images: files.map((image) => image.filename),
          });
        const hotelRoom = await this.hotelRoomsService.create(data);

        return {
            id: hotelRoom._id,
            description: hotelRoom.description,
            images: hotelRoom.images,
            isEnabled: hotelRoom.isEnabled,
            hotel: hotel
        };
    }

    // @UseGuards(
    //     // JwtAuthGuard,
    //      RolesGuard
    //     )
    // @Roles(roleEnum.admin)
    @Put('/admin/hotel-rooms/:id')
    @UseInterceptors(MulterFilesInterceptor())
    async updateRoom(
        @Param('id') id: ID, 
        @Body() updateHotelRoomParams: HotelRoomDtoValidate,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        let data = Object.assign({}, updateHotelRoomParams, {
            images: files?.map((file) => file.filename),
        });
        if(updateHotelRoomParams.images?.length) {
            data.images.push(...updateHotelRoomParams.images)
        }
        const updateRoom = await this.hotelRoomsService.update(id, data);
        const hotel = await this.hotelsService.findById(updateRoom.hotel);
        return {
            id: updateRoom._id,
            description: updateRoom.description,
            images: updateRoom.images,
            isEnabled: updateRoom.isEnabled,
            hotel: hotel
        }
    }

    @Get('/common/hotel-rooms/')
    async getRooms(
        @Query() searchRoomsParams: SearchRoomParams, 
    ) {
        const rooms = (
            await this.hotelRoomsService.search(searchRoomsParams)
        ) as (HotelRoomDocument & {hotel: HotelDocument})[];
        return rooms.map((room) => {
            const {id, description, images, hotel} = room;
            return {
                id,
                description,
                images,
                hotel: {
                  id: hotel.id,
                  title: hotel.title,
                }
            }
        })
    }

    @Get('/common/hotel-rooms/:id')
    async getRoom(@Param('id') id: ID) {
        const { _id, description, images, hotel } = await this.hotelRoomsService.findById(id);
        const hotelAnswer = await this.hotelsService.findById(hotel);

        return {
            id: _id,
            description: description,
            images: images,
            hotel: {
                id: hotelAnswer._id,
                title: hotelAnswer.title,
                description: hotelAnswer.description,
            }
        }
    }
}
