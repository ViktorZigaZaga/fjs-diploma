import { 
    ConnectedSocket, 
    MessageBody, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BadRequestException, UseFilters, UseGuards } from "@nestjs/common";
import { ID } from "../../interfaces/ID.types";
import { SupportRequestService } from "./support-request.service";
import { UsersService } from "../users/users.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { roleEnum } from "src/enums/roleEnum";
// import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { WsExceptionsFilter } from "src/filters/WsException.Filter";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})

export class SupportRequestGateway {
    constructor(
        private supportRequestService: SupportRequestService,
        private usersService: UsersService,
    ) {}
    
    @WebSocketServer()
    server: Server;

    @UseFilters(new WsExceptionsFilter())
    @UseGuards(
        // JwtAuthGuard, 
        RolesGuard)
    @Roles(roleEnum.client, roleEnum.manager)
    @SubscribeMessage('subscribeToChat') 
    async handleSubscribeToChat(
        @ConnectedSocket() client: Socket,
        @MessageBody('payload') payload: {chatId: ID},
    ) {
        return this.supportRequestService.subscribe(async (supportRequest, message) => {
            if (supportRequest._id === payload.chatId) {
                const { _id, sentAt, text, readAt, author } = message;
                const { name } = await this.usersService.findById(author);
                const user = (client.request as any)?.user;
                if(user.role === roleEnum.client && user._id !== author) {
                    throw new BadRequestException('У Вас нет доступа к этому запросу поддержки.')
                }
                const response = {
                  _id,
                  sentAt,
                  text,
                  readAt,
                  author: {
                    author,
                    name,
                  },
                };
                client.emit('subscribeToChat', response);
            }
        })
    }
}