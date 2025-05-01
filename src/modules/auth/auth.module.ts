import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { decrypt } from '@helpers/cipher';
import { NotificationService } from './notification.service'
import { DatabaseModule } from '@config/database/database.module'
import { RedisModule } from '@config/redis/redis.module'
import { UserModule } from '../user/user.module'

const IS_CRD_PLAIN = process.env.IS_CRD_PLAIN == 'true' ? true : false
const JWTKEY = IS_CRD_PLAIN ? process.env.JWTKEY : decrypt(process.env.JWTKEY)

@Module({
    imports: [
        // UserModule,
        forwardRef(() => UserModule),
        DatabaseModule,
        RedisModule,
        PassportModule,
        JwtModule.register({
            secret: JWTKEY,
            signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        NotificationService
    ],
    controllers: [AuthController],
    exports: [AuthService]
    
})
export class AuthModule { }