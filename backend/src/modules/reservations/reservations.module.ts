import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelRoomsModule } from "../hotel-rooms/hotel-rooms.module";
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from 'src/schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name, 
        schema: ReservationSchema
      }
    ]),
    HotelsModule,
    HotelRoomsModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})

export class ReservationsModule {}
