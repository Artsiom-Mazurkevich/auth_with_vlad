import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { ResponseTokens } from './types'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    localSignup(@Body() dto: AuthDto): Promise<ResponseTokens> {
        return this.authService.localSignup(dto)
    }
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    localSignin(@Body() dto: AuthDto): Promise<ResponseTokens> {
        return this.authService.localSignin(dto)
    }

    @UseGuards(AuthGuard('jwt-access'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const userId = req.user['sub']
        return this.authService.logout(userId)
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens() {
        return this.authService.refreshTokens()
    }
}
