import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomsController } from './hotel-rooms.controller';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HotelRoom.name, 
        schema: HotelRoomSchema,
      },
    ]),
  HotelsModule,
  ],
  providers: [HotelRoomsService],
  controllers: [HotelRoomsController],
  exports: [HotelRoomsService],
})

export class HotelRoomsModule {}
