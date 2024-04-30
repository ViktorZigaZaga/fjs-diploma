import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { 
    ISupportRequestEmployeeService 
} from 'src/interfaces/support/ISupportRequestEmployeeService.interface';
import { MarkMessagesAsReadDto } from 'src/interfaces/support/MarkMessagesAsReadDto.interface';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from 'src/schemas/support.schema';

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
        constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private MessageModel: Model<MessageDocument>
    ) {}

    async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
        try {
            const {supportRequest, createdBefore, user} = params;
            const { messages } = await this.SupportRequestModel.findById(supportRequest);
            const filterMessage = {
                _id: { $in: messages },
                readAt: { $exists: false },
                author: { $ne: user },
            };
            await this.MessageModel.updateMany(filterMessage, { readAt: createdBefore });
            await this.SupportRequestModel.updateMany(
                { _id: supportRequest },
                { $set: {"messages.$[element].readAt": createdBefore}},
                { arrayFilters: [
                    {"element.readAt": { $exists: false },
                    "element.author": { $ne: user }},
                ]}
            );
        } catch(err) {
            throw new BadRequestException(
                `Ошибка при указании статуса сообщений как прочитанные сотрудником: ${err}`
            );
        }
    }

    async getUnreadCount(supportRequest: ID): Promise<MessageDocument[]> {
        try {
            return (await this.SupportRequestModel
                    .findById(supportRequest)
                    .select('-__v')
                    .exec())
                    .messages
                    .filter(message => !message.readAt) || []
        } catch(err) {
            throw new BadRequestException(
                `Ошибка при получении кол-ва непрочитанных сотрудником: ${err}`
            );
        }
    }

    async closeRequest(supportRequest: ID): Promise<void> {
        try {
            const request = await this.SupportRequestModel
                .findById(supportRequest)
                .select('-__v')
                .exec();
            if (!request) {
                throw new BadRequestException(
                    `Запроса поддержки с таким ID не найдено: ${supportRequest}`
                );
            }
            request.isActive = false;
            await request.save();
            
        } catch(err) {
            throw new BadRequestException(`Ошибка при закрытии запроса поддержки: ${err}`);
        }
    }
}
