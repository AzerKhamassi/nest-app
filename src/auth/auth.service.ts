import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user/user.model';


@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async validateUser(email: string, password: string) {
        const user = await this.getUserByEmail(email);
        const result = await bcrypt.compare(password, user.password)
        if (user && result) {
            return user;
        }
        return null;
    }

    async login(user) {
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: jwt.sign(payload, process.env.SECRET),
        };
    }

    signup = async (name: string, email: string, username: string, password: string) => {
        try {
            const user = await this.userModel.findOne({ email })
            if (user)
                throw new HttpException('User already exists', HttpStatus.CONFLICT)
            const hashedPassword = await bcrypt.hash(password, 11)
            const createdUser = new this.userModel({ name, email, username, password: hashedPassword })
            const newUser = await createdUser.save()
            return newUser

        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    getUserByEmail = async (email: string) => {
        try {
            const user = await this.userModel.findOne({ email })
            if (user)
                return user
            else
                throw new HttpException('Invalid credentials!', HttpStatus.NOT_FOUND)

        } catch (error) {

            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}