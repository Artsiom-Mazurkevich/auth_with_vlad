import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { ResponseTokens } from './types'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AtGuard, RtGuard } from './common/guards'
import { GetCurrentUser, Public } from './common/decorators'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    localSignup(@Body() dto: AuthDto): Promise<ResponseTokens> {
        return this.authService.localSignup(dto)
    }

    @Public()
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    localSignin(@Body() dto: AuthDto): Promise<ResponseTokens> {
        return this.authService.localSignin(dto)
    }

    // @UseGuards(AuthGuard('jwt-access'))
    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    // logout(@Req() req: Request) {
    logout(@GetCurrentUser('sub') userId: string) {
        return this.authService.logout(userId)
    }

    // @UseGuards(AuthGuard('jwt-refresh'))
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUser('sub') userId: string, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken)
    }
}
