import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ID } from "src/interfaces/ID.types";
import { UsersService } from "../users/users.service";
import { UserDocument } from "src/schemas/user.schema";
import { LoginAuthDto } from "src/interfaces/auth/LoginAuthDto.interface";
import { RegisterAuthDto } from "src/interfaces/auth/RegisterAuthDto.interface";
import { ResponseRegisterDto } from "src/interfaces/auth/ResponseRegisterDto.interface";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    async validateUser(loginAuthDto: LoginAuthDto): Promise<UserDocument> {
        const user = this.usersService.findByEmail(loginAuthDto.email)
        if (user && bcrypt.compare((await user).passwordHash, loginAuthDto.password)) {
            return user;
        } 
        throw new UnauthorizedException("Неверные email или пароль");
    }

    async validateUserById(id: ID): Promise<UserDocument | null> {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new UnauthorizedException("Пользователь c таким ID не найден");
        }
        return user;
    }

    async register(registerAuthDto: RegisterAuthDto): Promise<ResponseRegisterDto> {
        const { email, password, name, contactPhone } = registerAuthDto;  
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new BadRequestException('Пользователь с таким email уже существует');
        }
        const salt = await bcrypt.genSalt(5);
        const passwordHash = bcrypt.hashSync(password, salt).toString();
        const newUser = await this.usersService.create({
            name,
            email,
            passwordHash,
            contactPhone: contactPhone || "Не указан",
        });
        return {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
        }
    }

    async login(loginAuthDto: LoginAuthDto): Promise<UserDocument> {
        const { email, password } = loginAuthDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Пользователь с таким email не найден');
        }
        const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный пароль');
        };
        return user
    }

    async logout(res: any): Promise<void> {
        res.status(204).end();
    }
}