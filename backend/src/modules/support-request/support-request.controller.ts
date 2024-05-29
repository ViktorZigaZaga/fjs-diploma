import { 
    BadRequestException, 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Query, 
    Request, 
    UseGuards 
} from "@nestjs/common";
import { ID } from "src/interfaces/ID.types";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { roleEnum } from "src/enums/roleEnum";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UsersService } from "../users/users.service";
import { SupportRequestService } from "./support-request.service";
import { SupportRequestClientService } from "./support-request-client.service";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { GetChatListParams } from "src/interfaces/support/GetChatListParams.interface";
import { CreateSupportRequestDto } from "src/interfaces/support/CreateSupportRequestDto.interface";
import { MarkMessagesAsReadDto } from "src/interfaces/support/MarkMessagesAsReadDto.interface";
import { SendMessageDto } from "src/interfaces/support/SendMessageDto.interface";

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportRequestController{
    constructor(
        private usersService: UsersService,
        private supportRequestService: SupportRequestService, 
        private supportRequestServiceClient: SupportRequestClientService,
        private supportRequestServiceEmployee: SupportRequestEmployeeService,
    ) {}

    @Roles(roleEnum.client)
    @Post('/client/support-requests')
    async createSupportRequest(
        @Body(DtoValidationPipe) body: CreateSupportRequestDto,
    ) {
        const supportRequest = await this.supportRequestServiceClient.createSupportRequest(body);

        await this.supportRequestService.sendMessage({
            author: supportRequest.user,
            supportRequest: supportRequest._id,
            text: body.text,
        });

        return {
            id: supportRequest._id,
            createdAt: supportRequest.createdAt,
            isActive: supportRequest.isActive,
            hasNewMessages: Boolean(
                (await this.supportRequestServiceClient
                    .getUnreadCount(supportRequest._id)
                )
            ),
        }
    }

    @Roles(roleEnum.client)
    @Get('/client/support-requests')
    async getSupportRequestClient(
        @Query() query: GetChatListParams,
    ) {
        const supportRequests = await this.supportRequestService.findSupportRequests(query);
        return supportRequests.map((item) => {
            return { 
                _id: item._id,
                createdAt: item.createdAt,
                isActive: item.isActive,
                hasNewMessages: Boolean(
                    (this.supportRequestServiceClient
                        .getUnreadCount(item._id)
                    )
                )
            }
        });
    }

    @Roles(roleEnum.manager)
    @Get('/manager/support-requests')
    async getSupportRequestManager(
        @Query() query: GetChatListParams,
    ) {
        const supportRequests = await this.supportRequestService.findSupportRequests(query);
        return supportRequests.map((item) => {        
            return {
                _id: item._id,
                createdAt: item.createdAt,
                isActive: item.isActive,
                hasNewMessages: Boolean(
                    (this.supportRequestServiceClient
                        .getUnreadCount(item._id)
                    )
                ),
                client: item.user 
            };
        });
    }

    @Roles(roleEnum.manager, roleEnum.client)
    @Get('/common/support-requests/:id/messages')
    async getAllMessageByIdSupport(
        @Param("id") id: ID,
        @Request() req: any
    ) {
        const messages = await this.supportRequestService.getMessages(id);
        const user = await this.usersService.findById(messages[0].author)
        if(req.user.role === roleEnum.client && req.user.id !== user.id){
            throw new BadRequestException('У Вас нет доступа к этому запросу поддержки.')
        }
        return messages.map((item) => {
            return {
                _id: item._id,
                createAt: item.sentAt,
                text: item.text,
                readAt: item.readAt || null,
                author: {
                    _id: user._id,
                    name: user.name
                }
            }
        });
    }

    @Roles(roleEnum.manager, roleEnum.client)
    @Post('/common/support-requests/:id/messages')
    async sendMessages(
        @Param("id") id: ID, 
        @Body(DtoValidationPipe) body: SendMessageDto,
        @Request() req: any,
    ) {
        // if(req.user.role === roleEnum.client && req.user.id !== body.author) {
        //     throw new BadRequestException('У Вас нет доступа к этому запросу поддержки....') 
        // }
        const {_id, sentAt, text, readAt} = await this.supportRequestService.sendMessage({
            author: body.author,
            supportRequest: id,
            text: body.text,
        });
        const user = await this.usersService.findById(body.author);

        return {
            _id: _id,
            createdAt: sentAt,
            readAt: readAt,
            text: text,
            author: {
              _id: user._id,
              name: user.name
            }
        }
    }

    @Roles(roleEnum.manager, roleEnum.client)
    @Post('/common/support-requests/:id/messages/read')
    async markMessagesAsRead(
        @Param("id") id: ID, 
        @Body(DtoValidationPipe) body: MarkMessagesAsReadDto,
        @Request() req: any,
    ) {
        try {
            if (req.user?.role === roleEnum.client){
                this.supportRequestServiceClient.markMessagesAsRead({
                    user: body.user,
                    supportRequest: id,
                    createdBefore: body.createdBefore,
                });
            }
            if (req.user?.role === roleEnum.manager) {
                this.supportRequestServiceEmployee.markMessagesAsRead({
                    user: body.user,
                    supportRequest: id,
                    createdBefore: new Date(body.createdBefore),
                });
            }
        } catch (err) {
            return {success: false, error: err}
        }
        return {success: true};
    }

    @Roles(roleEnum.manager, roleEnum.client)
    @Post('/common/support-requests/close/:id')
    async closeRequest(@Param("id") id: ID) {
        await this.supportRequestServiceEmployee.closeRequest(id);
    }
}