import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { RequestUser } from '../types'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
    async validate(payload: RequestUser) {
        return payload
    }
}
