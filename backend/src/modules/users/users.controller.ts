import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { Model } from "mongoose";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { roleEnum } from "src/enums/roleEnum";
import { UsersService } from "./users.service";
import { SearchUserParams } from "src/interfaces/user/SearchUserParams.interface";
import { UserDtoValidate } from "src/modules/users/dto/User.dto.validate";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { User, UserDocument } from "src/schemas/user.schema";


// @UseGuards(
//     // JwtAuthGuard, 
//     RolesGuard)
@Controller('api')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    // @Roles(roleEnum.admin)
    @Post('/admin/users')
    @UseGuards()
    async createUser(@Body(DtoValidationPipe) userParams: UserDtoValidate): Promise<UserDocument> {
        return this.usersService.create(userParams);
    }

    // @Roles(roleEnum.admin)
    @Get('/admin/users')
    @UseGuards()
    async getUsersAdmin(@Query() query: SearchUserParams): Promise<{users: UserDocument[], totalCount: number}> {
        const users = await this.usersService.findAll(query);
        const totalCount = await this.usersService.getTotalCount(query);
        return {users, totalCount};
    }

    // @Roles(roleEnum.manager)
    @Get('/manager/users')
    @UseGuards()
    async getUsersManager(@Query() query: SearchUserParams): Promise<{users: UserDocument[], totalCount: number}> {
        const users = await this.usersService.findAll(query);
        const totalCount = await this.usersService.getTotalCount(query);
        return {users, totalCount};
    }
}

