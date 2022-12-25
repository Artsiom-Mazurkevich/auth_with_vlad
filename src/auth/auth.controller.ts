import { Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('local/signup')
    localSignup() {
        this.authService.localSignup()
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
