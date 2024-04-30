import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { IReservationService } from 'src/interfaces/reservation/IReservationService.interface';
import { ReservationDto } from 'src/interfaces/reservation/ReservationDto.interface';
import { SearchReservationOptions } from 'src/interfaces/reservation/SearchReservationOptions.interface';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class ReservationsService implements IReservationService {
    constructor(
        @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
        private hotelsService: HotelsService,
        private hotelRoomsService: HotelRoomsService,
    ) {}

    async addReservation(data: ReservationDto): Promise<ReservationDocument> {
        try {
            const { userId, hotelId, roomId, dateStart, dateEnd } = data;

            const hotel = this.hotelsService.findById(hotelId);
            const hotelRoom = this.hotelRoomsService.findById(roomId);
            if (hotel && !(await hotelRoom).isEnabled) {
                throw new BadRequestException("Hомер с указанным ID отключён для бронирования");
            }

            const reservations = await this.getReservations({
                userId,
                dateStart,
                dateEnd,
            });
            if (reservations && reservations.length) {
                throw new BadRequestException("Даты уже зарезервированы");
            }

            const createReservation = new this.ReservationModel(data);
            await createReservation.save();
            return await this.ReservationModel
                .findById(createReservation._id)
                .select('-__v -userId')
                .populate([
                    {
                        path: 'roomId',
                        transform: function (value) {
                            return {
                                description: value.description,
                                images: value.images,
                            };
                        },
                    },
                    {
                        path: 'hotelId',
                        transform: function (value) {
                            return {
                                title: value.title,
                                description: value.description,
                            };
                        },
                    },
                ]);
        } catch(err) {
            throw new BadRequestException(`Ошибка при установки брони: ${err}`);
        }
    }
    async removeReservation(id: ID): Promise<void> {
        try {
            await this.ReservationModel.findByIdAndDelete(id).exec();
        } catch(err) {
            throw new BadRequestException(`Ошибка при удалении брони: ${err}`);
        }
    }

    async getReservations(filter: SearchReservationOptions): Promise<ReservationDocument[]> {
        try {
            const { userId } = filter;
            const parseFilter: any = {};
            userId && (parseFilter.userId = userId);
            filter.dateStart && (parseFilter.dateStart = { $gte: filter.dateStart });
            filter.dateEnd && (parseFilter.dateEnd = { $lte: filter.dateEnd });
            return await this.ReservationModel.find(parseFilter)
            .select('-__v -_id -userId')
            .populate([
                {
                    path: 'roomId',
                    transform: function (value) {
                        return {
                            description: value.description,
                            images: value.images,
                        };
                    },
                },
                {
                    path: 'hotelId',
                    transform: function (value) {
                        return {
                            title: value.title,
                            description: value.description,
                        };
                    },
                },
            ])
            .exec();
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании списка бронирований: ${err}`);
        }
    }
}
