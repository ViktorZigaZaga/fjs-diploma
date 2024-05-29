import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { IHotelRoomService } from 'src/interfaces/hotel/IHotelRoomService.interface';
import { SearchRoomParams } from 'src/interfaces/hotel/SearchRoomParams.interface';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { HotelRoomDtoValidate } from './dto/HotelRoom.dto.validate';

@Injectable()
export class HotelRoomsService implements IHotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    ) {}

    async create(data: Partial<HotelRoomDtoValidate>): Promise<HotelRoomDocument> {
        try {
            const createRoom = new this.HotelRoomModel(data);
            createRoom.save()
            return createRoom;
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании номера: ${err}`);
        }
    }

    async findById(id: ID): Promise<HotelRoomDocument> {
        try {
            return await this.HotelRoomModel
                .findById(id)
                .populate('hotel')
                .select('-__v -createdAt -updatedAt')
                .exec();
        } catch(err) {
            throw new BadRequestException('Номера с указанным ID не существует');
        }
    }

    async search(params: SearchRoomParams): Promise<HotelRoomDocument[]> {
        try {
            const {limit, offset, hotel, isEnabled} = params;
            const query: Partial<SearchRoomParams> = {}
            if(hotel) {
                query.hotel = hotel
            }
            if(typeof isEnabled !== "undefined") {
                query.isEnabled = isEnabled;
            }
            return await this.HotelRoomModel
            .find(query)
            .limit(limit || 10)
            .skip(offset || 0)
            .populate('hotel')
            .select('-__v -createdAt -updatedAt');
        } catch(err) {
            throw new BadRequestException(
                `Ошибка при создании списка номеров (пагантенация и поиск): ${err}`
            );
        }
    }

    async update(id: ID, data: Partial<HotelRoomDtoValidate>): Promise<HotelRoomDocument> {
        try {
            return await this.HotelRoomModel.findByIdAndUpdate(
                {_id: id}, 
                {$set: {...data, updatedAt: Date.now()}},
                {new: true}
            )
            .select('-__v -createdAt -updatedAt');
        } catch(err) {
            throw new BadRequestException(`Ошибка при редактировании номера: ${err}`);
        }
    }
}
