import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { ResponseTokens } from './types'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { config } from 'rxjs'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async hashData(data: string): Promise<string> {
        return await argon.hash(data)
    }

    async create_JWT_Tokens(userId: string, email: string): Promise<ResponseTokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    expiresIn: '20m',
                    secret: this.config.get('JWT_SECRET'),
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    expiresIn: '7 days',
                    secret: this.config.get('JWT_SECRET'),
                }
            ),
        ])
        return {
            access_token: at,
            refresh_token: rt,
        }
    }

    async updateRtHash(userId: string, oldRefreshToken: string) {
        const newRefreshToken = await this.hashData(oldRefreshToken)
        await this.userModel.findByIdAndUpdate(userId, { hashedRt: newRefreshToken })
        // await this.prisma.user.update({
        //     where: {
        //         id: userId,
        //     },
        //     data: {
        //         hashedRt: newRefreshToken,
        //     },
        // })
    }

    async localSignup(dto: AuthDto): Promise<ResponseTokens> {
        const hashedPass = await this.hashData(dto.password)
        // const candidate = await this.prisma.user.findUnique({ where: { email: dto.email } })
        const candidate = await this.userModel.findOne({ email: dto.email })
        if (candidate) throw new BadRequestException()
        // const newUser = await this.prisma.user.create({
        //     data: {
        //         email: dto.email,
        //         hash: hashedPass,
        //     },
        // })
        const newUser = await this.userModel.create({ email: dto.email, hash: hashedPass })
        const tokens = await this.create_JWT_Tokens(newUser.id, newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }
    localSignin() {}
    logout() {}
    refreshTokens() {}
}
