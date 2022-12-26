import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('local/signup')
    localSignup(@Body() dto: AuthDto) {
        this.authService.localSignup(dto)
    }
    @Post('local/signin')
    localSignin() {
        this.authService.localSignin()
    }
    @Post('logout')
    logout() {
        this.authService.logout()
    }
    @Post('refresh')
    refreshTokens() {
        this.authService.refreshTokens()
    }
}
