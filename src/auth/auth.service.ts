import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { ResponseTokens } from './types'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async hashPass(pass: string): Promise<string> {
        return await argon.hash(pass)
    }

    async localSignup(dto: AuthDto): Promise<ResponseTokens> {
        // const newUser = await this.prisma.user.create({
        //     data: {
        //         email: dto.email,
        //         hash: dto.password,
        //     },
        // })
        const hashedPass = await this.hashPass(dto.password)
        const candidate = await this.prisma.user.findUnique({ where: { email: dto.email } })
        if (candidate) throw new BadRequestException()
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hashedPass,
            },
        })
    }
    localSignin() {}
    logout() {}
    refreshTokens() {}
}
