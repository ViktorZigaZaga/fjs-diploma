import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {  
    public canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
    public handleRequest(err:any, user:any) {
        if (err) {
        throw err;
        }
        if (user) {
        throw new UnauthorizedException('Доступно только неавторизованным пользователям');
        }
        return user._id;
    }
}