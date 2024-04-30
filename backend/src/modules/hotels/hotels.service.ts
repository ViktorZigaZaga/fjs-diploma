import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { IHotelService } from 'src/interfaces/hotel/IHotelService.interface';
import { SearchHotelParams } from 'src/interfaces/hotel/SearchHotelParams.interface';
import { UpdateHotelParams } from 'src/interfaces/hotel/UpdateHotelParams.interface';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelDtoValidate } from './dto/Hotel.dto.validate';

@Injectable()
export class HotelsService implements IHotelService {
    constructor(
        @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>
    ) {}

    async create(data: Partial<HotelDtoValidate>): Promise<HotelDocument> {
        try {
            const createHotel = new this.HotelModel(data);
            await createHotel.save();
            return createHotel;
        } catch (err) {
            throw new BadRequestException(`Ошибка при создании отеля: ${err}`);
        }

    }
    async findById(id: ID): Promise<Hotel> {
        try {
            return await this.HotelModel
                .findById(id)
                .select('-__v -createdAt -updatedAt')
                .exec();
        } catch(err) {
            throw new BadRequestException('Отеля с указанным ID не существует');
        }
    }
    async search(params: SearchHotelParams): Promise<HotelDocument[]> {
        try {
            const {limit, offset, title} = params;
            const query = {
                title: { $regex: new RegExp(title, 'i') }
            }
            return await this.HotelModel
                .find(query)
                .limit(limit || 3)
                .skip(offset || 0)
                .select('-__v -createdAt -updatedAt');
        } catch(err) {
            throw new BadRequestException(
                `Ошибка при создании списка отелей (пагантенация и поиск): ${err}`
            );
        }
    }
    async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
        try {
            return await this.HotelModel.findByIdAndUpdate(
                {_id: id}, 
                {$set: {...data, updatedAt: Date.now()}},
                {new: true}
            ).select('-__v');
        } catch(err) {
            throw new BadRequestException(`Ошибка при редактировании отеля: ${err}`);
        }
    }

    async getTotalCount(params: SearchHotelParams): Promise<number> {
        try {    
            const {title} = params;
            const query = {
                title: { $regex: new RegExp(title, 'i') }
            }
            return await this.HotelModel
                .find(query)
                .countDocuments()
        } catch (err) {
            throw new BadRequestException(
                `Ошибка при возврате кол-во док-ов в коллекции: ${err}`
            );
        }
    }
}
