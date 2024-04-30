import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { ISupportRequest } from "src/interfaces/support/ISupportRequest.interface";
import { User } from "./user.schema";
import { MessageDocument } from "./message.schema";


export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema()
export class SupportRequest implements ISupportRequest {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Не указан ID пользователя'], type: mongoose.Schema.Types.ObjectId, ref: () => User })
    user: ObjectId;

    @Prop({ required: [true, 'Не указана дата создания сообщения'], default: new Date() })
    createdAt: Date;

    @Prop({ required: false, default: [] })
    messages: MessageDocument[];

    @Prop({ required: false, default: true })
    isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);