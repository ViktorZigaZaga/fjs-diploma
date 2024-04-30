import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { SupportRequest, SupportRequestSchema } from 'src/schemas/support.schema';
import { SupportRequestGateway } from './support-request.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
          name: Message.name, 
          schema: MessageSchema
      },
      {
          name: SupportRequest.name, 
          schema: SupportRequestSchema
      }
  ]),
  UsersModule,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    SupportRequestGateway,
  ],
  controllers: [SupportRequestController],
  exports: [SupportRequestService],
})

export class SupportRequestModule {}
