import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { GetChatListParams } from 'src/interfaces/support/GetChatListParams.interface';
import { ISupportRequestService } from 'src/interfaces/support/ISupportRequestService.interface';
import { SendMessageDto } from 'src/interfaces/support/SendMessageDto.interface';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from 'src/schemas/support.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
    constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
        private chatEmitter: EventEmitter2,
        private usersService: UsersService,
    ) {}

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
        try {
            const {user, isActive, limit, offset} = params;
            const query: Partial<GetChatListParams> = { isActive }
            user && (query.user = user);
            return await this.SupportRequestModel
                .find(query)
                .limit(limit || 10)
                .skip(offset || 0)
                .select('-__v')
                .populate([                
                    {
                        path: 'user',
                        transform: function (value) {
                            return {
                                id: value._id,
                                name: value.name,
                                email: value.email,
                                contactPhone: value.contactPhone,
                            };
                        },
                    }
                ])
                .exec()
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании списка запросов поддержки: ${err}`);
        }
    }

    async sendMessage(sendMessageDto: SendMessageDto): Promise<MessageDocument> {
        try {
            const {supportRequest, author, text} = sendMessageDto;
            const request = await this.SupportRequestModel
                .findById(supportRequest)
                .select('-__v')
                .exec();
            if (!request) {
                throw new BadRequestException(
                    `Запроса поддержки с таким ID не найдено: ${supportRequest}`
                );
            }
            const user = await this.usersService.findById(author);
            if (!user) {
              throw new BadRequestException(`Автора с данным ID не найдено: ${author}`);
            }

            const createMessage = new this.MessageModel({
                author,
                text,
                sentAt: new Date()
            });
            await createMessage.save();
            request.messages.push(createMessage);
            await request.save();
            this.chatEmitter.emit('newMessage', { request, createMessage });
            return createMessage;
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании сообщения: ${err}`);
        }
    }

    async getMessages(supportRequest: ID): Promise<MessageDocument[]> {
        try {
            return (await this.SupportRequestModel
                    .findById(supportRequest)
                    .select('-__v')
                    .exec()
            ).messages || [];
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании списка сообщений: ${err}`);
        }
    }

    subscribe(
        handler: (
            supportRequest: SupportRequestDocument, 
            message: MessageDocument
        ) => void): () => void {
            try {
                this.chatEmitter.on('newMessage', ({ supportRequest, message }) => {
                    handler(supportRequest, message);
                })
                return;
            } catch(err) {
                throw new BadRequestException(`Ошибка при подписании на событий: ${err}`);
            }
        }
}
