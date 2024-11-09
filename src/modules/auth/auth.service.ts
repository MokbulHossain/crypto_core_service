import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { REDIS_CONNECTION} from '../../config/constants'
import { UserService } from '../user/user.service'
import {LoginAuthDto, RegisterAuthDto} from '../../dto'
import { genRandomInRange } from '@helpers/utils'
import axios from 'axios'
import { winstonLog } from '@config/winstonLog'

@Injectable()
export class AuthService {
    constructor(
        @Inject(REDIS_CONNECTION) private redisClient: any,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async validateAuth(email: string, password: string) {
        
        const user = await this.userService.getSingleser(email)
 
        if(!user) {

            return { code: 4001, resp_keyword: 'usernotfound' }
        }
        else if(await this.comparePassword(password, user.password)) {

            switch (user.status) {
                case 2 :
                    return { code: 4003, resp_keyword: 'userislocked' }
                    
                case 3 :
                    return { code: 4004, resp_keyword: 'userisdeleted' }
                    
                case 4 :
                    return { code: 4004, resp_keyword: 'useristemporarylocked' } 
            }

            return { code: 100, resp_keyword: 'loginsuccess' }
        }
        else {

            return { code: 4002, resp_keyword: 'userinvalidpassword' }
        }
    }

    async registration(regbody: RegisterAuthDto){

        const user = await this.userService.getSingleser(regbody.email)
        if (user) {
            return { code: 4001, resp_keyword: 'useralreadyregistered' }
        }

        const password = this.hashPassword(regbody.password)
        const createData = await this.userService.create({...regbody, password})
        const otp = genRandomInRange(100000, 999999)
        const user_id = createData.id
        const notificationBody = {
            email: regbody.email,
            body: `OTP is `, otp,
            subject: "OTP-SEND"
        }

        this.userService.createDeviceLog({...regbody, otp, otp_type: 'LOGIN', otp_createdat: new Date()})
        const url = process.env.EMAIL_NOTIFICATION_URL
        axios({
            url,
            method: 'POST',
            data: notificationBody,
            }).then(async response => {
        
                const responseData = response['data']
                winstonLog.log('info', `${url} api Response %o`, responseData, { transactionid_for_log: `user_id=${user_id}`});
                return responseData
                
            }).catch(async (e) => {

                const errorResponse = e['response'] ? (e['response']['data'] ? e['response']['data'] : e['response']) : e
                winstonLog.log('error', `${url} api Response %o`, errorResponse, { transactionid_for_log: `user_id=${user_id}`})

                return null
            })

    }

    private generateId(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    private async getUserTokenCount(userId) {
        const pattern = `enduser_auth:${userId}:token*`
        let count = 0;
        let cursor = '0'
        
        do {
          const [nextCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          count += keys.length;
          cursor = nextCursor;
        } while (cursor !== '0' && count < 3)
        
        return count;
      }

    private async generateToken(user) {
        const jti =  `${Date.now()}_${this.generateId(10)}`
        const token = await this.jwtService.signAsync({...user,jti});
        const decoded = await this.jwtService.decode(token);
        const key = `enduser_auth:${user.id}:token:` + jti;
        if (decoded['exp']) { 
             await  this.redisClient.setEx(key, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));
        } else{
            await this.redisClient.set(key,  JSON.stringify(user));
        }
        return token;
    }

    private async generateRefreshToken(user) {
        const jti =  `${Date.now()}_${this.generateId(10)}`
        const token = await this.jwtService.signAsync({...user,jti}, { secret: process.env.REFRESH_KEY, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
        const decoded = await this.jwtService.decode(token);
        const key = `enduser_auth:${user.id}:refreshToken:` + jti;
        if (decoded['exp']) { 
             await  this.redisClient.setEx(key, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));
        } else{
            await this.redisClient.set(key,  JSON.stringify(user));
        }
        return token;
    }

    public async checkJwtTokenInRedis(user_id,jti) {

        const key = `enduser_auth:${user_id}:token:` + jti;
        const user = await this.redisClient.get(key)
        return user ? JSON.parse(user) : null
    }

    public async checkJwtRefreshTokenInRedis(user_id,jti) {

        const key = `enduser_auth:${user_id}:refreshToken:` + jti;
        const user = await this.redisClient.get(key)
        return user ? JSON.parse(user) : null
    }

    public async removeJwtRefreshTokenInRedis(user_id,jti) {

        const key = `enduser_auth:${user_id}:refreshToken:` + jti;
        return this.redisClient.del(key)
    }

    public async login(user) {

        const {id, email, mobile, device_id} = user
        const tokenData = { id, email, mobile, device_id }

        const ActiveAccCount = await this.getUserTokenCount(id)
        if ((ActiveAccCount + 1) > 3) {
            // max 3 device already have logged in...
            return null
        }

        const [access_token, refresh_token] = await Promise.all([ await this.generateToken(tokenData), await this.generateRefreshToken(tokenData)]);
        const [decoded, decoded2] = await Promise.all([await this.jwtService.decode(access_token), await this.jwtService.decode(refresh_token)])
        return { ...user, access_token, access_token_expires: decoded['exp'] || 7991326775, refresh_token, refresh_token_expires: decoded2['exp'] || 7991326775 };
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}