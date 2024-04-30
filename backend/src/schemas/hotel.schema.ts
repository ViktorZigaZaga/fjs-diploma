import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IHotel } from "src/interfaces/hotel/IHotel.interface";

export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel implements IHotel {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Не указано название отеля'] })
    title: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: [true, 'Не указана дата добавления отеля'], default: new Date() })
    createdAt: Date;

    @Prop({ required: [true, 'Не указана дата обновления отеля'], default: new Date() })
    updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);