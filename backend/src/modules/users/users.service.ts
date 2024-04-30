import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/interfaces/ID.types';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IUserService } from 'src/interfaces/user/IUserService.intarface';
import { SearchUserParams } from 'src/interfaces/user/SearchUserParams.interface';
import { UserDtoValidate } from './dto/User.dto.validate';

@Injectable()
export class UsersService implements IUserService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: Model<UserDocument>
    ) {}

    async create(data: Partial<UserDtoValidate>): Promise<UserDocument> {
        try {
            const createdUser = new this.UserModel(data);
            await createdUser.save();
            return await this.UserModel
                .findOne({ email: createdUser.email })
                .select('-__v -passwordHash');
        } catch(err) {
            throw new BadRequestException(`Ошибка при создании пользователя: ${err}`);
        }
    }
    async findById(id: ID): Promise<UserDocument> {
        try {
            return await this.UserModel.findById(id).select('-__v').exec();
        } catch(err) {
            throw new BadRequestException('Пользователя с указанным ID не существует');
        }
    }
    async findByEmail(email: string): Promise<UserDocument> {
        try {
            return await this.UserModel.findOne({ email }).select('-__v');
        } catch(err) {
            throw new BadRequestException(`Пользователя с указанным email не существует: ${err}`);
        }
    }
    async findAll(params: SearchUserParams): Promise<UserDocument[]> {
        try {
            const {limit, offset, email, name, contactPhone} = params;     
            return await this.UserModel
                .find(
                    {$or: [                    
                        {email: { $regex: new RegExp(email, 'i') }}, 
                        {name: { $regex: new RegExp(name, 'i') }},
                        {contactPhone: { $regex: new RegExp(contactPhone, 'i')}}
                    ]}

                )
                .limit(limit || 10)
                .skip(offset || 0)
                .select('-__v -role -passwordHash');
        } catch (err) {
            throw new BadRequestException(
                `Ошибка при создании списка пользователей (пагантенация и поиск): ${err}`
            );
        }

    }

    async getTotalCount(params: SearchUserParams): Promise<number> {
        try {    
            const {email, name, contactPhone} = params; 
            return await this.UserModel
                .find(
                    {$or: [                    
                        {email: { $regex: new RegExp(email, 'i') }}, 
                        {name: { $regex: new RegExp(name, 'i') }},
                        {contactPhone: { $regex: new RegExp(contactPhone, 'i')}}
                    ]}

                )
                .countDocuments()
        } catch (err) {
            throw new BadRequestException(
                `Ошибка при возврате кол-во док-ов в коллекции: ${err}`
            );
        }
    }
}
