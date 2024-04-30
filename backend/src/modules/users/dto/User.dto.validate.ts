import { IsString, IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { roleEnum } from "src/enums/roleEnum";

export class UserDtoValidate {
    @IsNotEmpty() @IsString() @IsEmail()
    email: string;
  
    @IsNotEmpty() @IsString() @MinLength(6)
    passwordHash: string;
  
    @IsNotEmpty() @IsString()
    name: string;
  
    @IsOptional() @IsString()
    contactPhone?: string;
  
    @IsString() @IsIn(Object.values(roleEnum))
    role: string;
}