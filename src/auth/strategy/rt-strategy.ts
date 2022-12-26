import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport'
import { ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
            passReqToCallback: true,
        })
    }
    async validate(payload: any) {
        return payload
    }
}
