import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsService } from "./hotels.service";
import { Hotel, HotelSchema } from '../../schemas/hotel.schema';
import { HotelsController } from "./hotels.controller";

@Module({ 
    imports: [
        MongooseModule.forFeature([
            {
                name: Hotel.name, 
                schema: HotelSchema,
            },
        ]),
    ],
    providers: [HotelsService],
    exports: [HotelsService],
    controllers: [HotelsController]
})

export class HotelsModule {}