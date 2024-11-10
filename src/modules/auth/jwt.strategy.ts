import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService} from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           //  ignoreExpiration: false,
             ignoreExpiration: true,
             secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
  
        //check if user in the token actually exist
        const user = await this.authService.checkJwtTokenInRedis(payload.user_id,payload.jti);

        if (!user) {
            throw new UnauthorizedException('You are not authorized to perform the operation');
        }
        return {...user, jti: payload.jti};
    }

}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
    constructor(private readonly authService: AuthService) {
        super({
             jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
           //  ignoreExpiration: false,
             ignoreExpiration: true,
             secretOrKey: process.env.REFRESH_KEY,
        });
    }

    async validate(payload: any) {

      //check if user in the token actually exist
      const user = await this.authService.checkJwtRefreshTokenInRedis(payload.user_id,payload.jti);

      if (!user) {
          console.log('authorized')
          throw new UnauthorizedException('You are not authorized to perform the operation');
      }
      return payload;

    }

}