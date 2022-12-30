import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { ResponseTokens } from './types'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
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
    }

    async localSignup(dto: AuthDto): Promise<ResponseTokens> {
        const hashedPass = await this.hashData(dto.password)
        const candidate = await this.userModel.findOne({ email: dto.email })
        if (candidate) throw new BadRequestException('User with this email already exist')
        const newUser = await this.userModel.create({ email: dto.email, hash: hashedPass })
        const tokens = await this.create_JWT_Tokens(newUser.id, newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }
    async localSignin(dto: AuthDto): Promise<ResponseTokens> {
        const user = await this.userModel.findOne({ email: dto.email })
        if (!user) throw new BadRequestException('User with this email does not exist')
        const matchHash = await argon.verify(user.hash, dto.password)
        if (!matchHash) throw new ForbiddenException()
        const tokens = await this.create_JWT_Tokens(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }
    async logout(userId: string) {
        try {
            await this.userModel.findByIdAndUpdate(userId, { hashedRt: null })
            return 'logout success'
        } catch (e) {
            throw new InternalServerErrorException('unexpected error: ', e)
        }
    }
    refreshTokens() {}
}
