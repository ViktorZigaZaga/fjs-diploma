import { Controller, 
    Get, 
    Post, 
    Delete, 
    Body, 
    Param, 
    Request, 
    Query, 
    ForbiddenException, 
    UseGuards 
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { roleEnum } from 'src/enums/roleEnum';
// JwtAuthGuard, 
import { ID } from 'src/interfaces/ID.types';
import { ReservationsService } from './reservations.service';
import { DtoValidationPipe } from 'src/validators/dto.validation.pipe';
import { ReservationDto } from 'src/interfaces/reservation/ReservationDto.interface';
import { 
    SearchReservationOptions 
} from 'src/interfaces/reservation/SearchReservationOptions.interface';

@UseGuards(
    // JwtAuthGuard, 
    RolesGuard)
@Controller('api')
export class ReservationsController {
    constructor(
        private reservationService: ReservationsService,
    ) {}

    @Roles(roleEnum.client)
    @Post('/client/reservations')
    async addReservstion(
        @Body(DtoValidationPipe) body: ReservationDto,
    ) {
        return await this.reservationService.addReservation(body);
    }

    @Roles(roleEnum.client)
    @Get('/client/reservations')
    async getReservationListByClient(
        @Query() searchReservationOptions: SearchReservationOptions,
    ) {
        return this.reservationService.getReservations(searchReservationOptions);
    }

    @Roles(roleEnum.manager)
    @Get('/manager/reservations/:userId')
    async getReservationListByManager(@Param('userId') userId: ID) {
        return await this.reservationService.getReservations({
            userId,
        });
    }

    
    @Roles(roleEnum.client)
    @Delete('/client/reservations/:id')
    async deleteReservationByClient(
        @Param('id') id: ID,
        @Request() req: any
    ) {
        const reservationListByClient = this.getReservationListByClient(req.user.id);
        const deleteId = (await reservationListByClient).filter(item => item.userId === id);
        if(!deleteId) {
            throw new ForbiddenException("ID текущего пользователя не совпадает с ID пользователя в брони");
        }
        await this.reservationService.removeReservation(id);
        return;
    }

    @Roles(roleEnum.manager)
    @Delete('/manager/reservations/:id')
    async deleteReservationByManager(@Param('id') id: ID) {
        await this.reservationService.removeReservation(id);
        return;
    }

}
