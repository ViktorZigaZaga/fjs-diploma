import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { HotelRoomsModule } from './modules/hotel-rooms/hotel-rooms.module';
import { SupportRequestModule } from './modules/support-request/support-request.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL_CONNECTION || "mongodb://127.0.0.1:27017/mydb"),
    EventEmitterModule.forRoot({      
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 100,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    AuthModule,
    UsersModule,
    HotelsModule,
    HotelRoomsModule,
    ReservationsModule,
    SupportRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
