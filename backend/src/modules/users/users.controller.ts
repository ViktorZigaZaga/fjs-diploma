import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { roleEnum } from "src/enums/roleEnum";
import { UsersService } from "./users.service";
import { SearchUserParams } from "src/interfaces/user/SearchUserParams.interface";
import { CreateUserDto } from "src/interfaces/user/CreateUserDto.interface";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import {  UserDocument } from "src/schemas/user.schema";


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Roles(roleEnum.admin)
    @Post('/admin/users')
    @UseGuards()
    async createUser(@Body(DtoValidationPipe) userParams: CreateUserDto): Promise<UserDocument> {
        const { email, password, name, contactPhone, role } = userParams;  
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new BadRequestException('Пользователь с таким email уже существует');
        }
        const salt = await bcrypt.genSalt(5);
        const passwordHash = bcrypt.hashSync(password, salt).toString();
        return this.usersService.create({
            name,
            email,
            passwordHash,
            contactPhone: contactPhone || "Не указан",
            role
        });
    }

    @Roles(roleEnum.admin)
    @Get('/admin/users')
    @UseGuards()
    async getUsersAdmin(@Query() query: SearchUserParams): Promise<{users: UserDocument[], totalCount: number}> {
        const users = await this.usersService.findAll(query);
        const totalCount = await this.usersService.getTotalCount(query);
        return {users, totalCount};
    }

    @Roles(roleEnum.manager)
    @Get('/manager/users')
    @UseGuards()
    async getUsersManager(@Query() query: SearchUserParams): Promise<{users: UserDocument[], totalCount: number}> {
        const users = await this.usersService.findAll(query);
        const totalCount = await this.usersService.getTotalCount(query);
        return {users, totalCount};
    }
}

