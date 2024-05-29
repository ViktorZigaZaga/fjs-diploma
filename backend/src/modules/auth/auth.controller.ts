import { Body, Controller, Post, UseGuards, Req, Res, Get } from "@nestjs/common";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local.guard"
import { JwtAuthGuard } from "./guards/jwt.guard";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { LoginAuthDto } from "src/interfaces/auth/LoginAuthDto.interface";
import { RegisterAuthDto } from "src/interfaces/auth/RegisterAuthDto.interface";
import { ResponseRegisterDto } from "src/interfaces/auth/ResponseRegisterDto.interface";
import { ResponseLoginDto } from "src/interfaces/auth/ResponseLoginDto.interface";

@Controller('api')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
    ) {}

    @Post('/client/register')
    async register(
        @Body(DtoValidationPipe) registerAuthDto: RegisterAuthDto,
    ): Promise<ResponseRegisterDto> {
        return await this.authService.register(registerAuthDto);
    }
    
    @Post('/auth/login')
    @UseGuards(LocalAuthGuard)
    async login(
        @Body(DtoValidationPipe) loginAuthDto: LoginAuthDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<ResponseLoginDto> {
        const {_id, email, name, contactPhone, role} =  await this.authService.login(loginAuthDto);
        const token = await this.jwtService.signAsync({
            _id,
            email,
            role
        });
        response.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return {            
            email,
            name,
            contactPhone, 
            token
        }
    }

    @Post('/auth/logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        response.clearCookie('access_token');
        await this.authService.logout(response);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/auth/currentUser')
    async getCurrentUser(@Req() req: Request) {
        return req.user; 
    }
}
