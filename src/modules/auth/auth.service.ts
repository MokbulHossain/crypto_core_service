import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { REDIS_CONNECTION} from '../../config/constants'
import { UserService } from '../user/user.service'
import {LoginAuthDto, RegisterAuthDto, ResendOTPDto, OTPValidateDto} from '../../dto'
import { genRandomInRange } from '@helpers/utils'
import axios from 'axios'
import { winstonLog } from '@config/winstonLog'
import { NotificationService } from './notification.service'
import moment from 'moment';

@Injectable()
export class AuthService {
    constructor(
        @Inject(REDIS_CONNECTION) private redisClient: any,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationService
    ) { }

    async validateAuth(email: string, password: string, reqbody) {
        
        const user = await this.userService.getSingleuser(email)
 
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

            const otp = genRandomInRange(100000, 999999)
            console.log('otp => ', otp)
            const user_id = user.id
     
            this.userService.createDeviceLog({...reqbody, user_id, otp, otp_type: 'LOGIN', otp_createdat: new Date()})
            
            this.notificationService.sendEmail({
                email: user.email, 
                body: `OTP is ${otp}`, 
                subject: 'APP OTP', 
                user_id
            })
            return { code: 100, resp_keyword: 'Ok' }
        }
        else {

            return { code: 4002, resp_keyword: 'userinvalidpassword' }
        }
    }

    async registration(regbody: RegisterAuthDto){

        const user = await this.userService.getSingleuser(regbody.email)
        if (user) {
            return { code: 4001, resp_keyword: 'useralreadyregistered' }
        }

        const password = await this.hashPassword(regbody.password)
        const createData = await this.userService.tempcreate({...regbody, password})
        const otp = genRandomInRange(100000, 999999)
        console.log('otp => ', otp)
        const user_id = createData.id
 
        this.userService.createDeviceLog({...regbody, user_id, otp, otp_type: 'REGISTRATION', otp_createdat: new Date()})
        
        this.notificationService.sendEmail({
            email: regbody.email, 
            body: `OTP is ${otp}`, 
            subject: 'APP OTP', 
            user_id
        })

        return { code: 100, resp_keyword: 'userregistrationsuccess' }
    }

    async resendOTP (reqbody: ResendOTPDto) {

        const deviceinfo = await this.userService.getDeviceLog(reqbody)
        if (!deviceinfo) {
            return { code: 4001, resp_keyword: 'devicenotfound' }
        }

        const otp = genRandomInRange(100000, 999999)

        this.notificationService.sendEmail({
            email: deviceinfo.email, 
            body: `OTP is ${otp}`, 
            subject: 'APP OTP', 
            user_id: deviceinfo.user_id
        })
        this.userService.updateDeviceLog( { otp, otp_createdat: new Date() }, deviceinfo.id )

        return { code: 100, resp_keyword: 'Ok' }

    }

    async validateOTP(reqbody: OTPValidateDto) {

        let userData = null, locked = false
        const deviceinfo = await this.userService.getDeviceLog(reqbody)
        if (!deviceinfo) {
            return { code: 4001, resp_keyword: 'devicenotfound' }
        }

        if (deviceinfo.otp_used) {
            return { code: 4000, resp_keyword: 'otpalreadyused' }
        }

        const protocols = await this.userService.protocol()
        const total_attempt = deviceinfo.total_attempt + 1

        // same device...
        if (total_attempt > protocols.login_max_retry && moment(new Date()).diff(
            moment(new Date(deviceinfo.otp_createdat)),
            'minutes',
        ) < protocols.login_attempt_interval_minutes) {

            return { code: 4002, resp_keyword: 'temporaryblockotp' }
        }

        // other device....
        if (deviceinfo.otp_type != 'REGISTRATION') {
            userData = await this.userService.getSingleuser( deviceinfo.email )
            // check temp block or not...
            if (userData.status == 4 && moment(new Date()).diff(
                moment(new Date(userData.locked_at)),
                'minutes',
            ) < protocols.login_attempt_interval_minutes) {

                return { code: 4002, resp_keyword: 'temporaryblockotp' }
            }
        }

        // check otp..
        if (deviceinfo.otp != reqbody.otp) {
            // lock temporary....
            if (total_attempt >= protocols.login_max_retry && deviceinfo.otp_type != 'REGISTRATION') {
                this.userService.updateUserDataByEmail({status: 4, locked_at: new Date()}, deviceinfo.email)
                locked = true
            } else if (total_attempt >= protocols.login_max_retry) {
                locked = true
            }
            // increase total_attempt...
            this.userService.updateDeviceLog( { total_attempt }, deviceinfo.id )
            return { code: 4003, resp_keyword: locked ? 'temporaryblockotp' : 'invalidotp' }
        }

        console.log(`Math.round((((new Date().valueOf() - new Date(deviceinfo.otp_createdat).valueOf()) % 86400000) % 3600000) / 60000) => `, Math.round((((new Date().valueOf() - new Date(deviceinfo.otp_createdat).valueOf()) % 86400000) % 3600000) / 60000))
        console.log(`protocols.otp_expiry_minutes => `, protocols.otp_expiry_minutes)
        console.log(`deviceinfo.otp_createdat => `, deviceinfo.otp_createdat)
        console.log(`new Date() => `, new Date())
        // check otp expiry...
        let time = Math.round((((new Date().valueOf() - new Date(deviceinfo.otp_createdat).valueOf()) % 86400000) % 3600000) / 60000); //in minutes difference
        if (time > protocols.otp_expiry_minutes) {
            this.userService.updateDeviceLog( { total_attempt }, deviceinfo.id )
            return { code: 4002, resp_keyword: 'otpexpire' }
        }

        switch (deviceinfo.otp_type) {

            case "LOGIN" :
            case "FORGETPASS" :
                break

            case "REGISTRATION" :
                const tempuser = await this.userService.getSingleTempuser(deviceinfo.email)
                delete tempuser.id
                console.log('tempuser => ', tempuser)
                const [newuser,] = await Promise.all([
                    this.userService.create({...tempuser['dataValues']}),
                    this.userService.deleteTempuser(deviceinfo.email)
                ])
                userData = newuser
                break
        }

        this.userService.updateDeviceLog( { user_id:userData.id, otp_used:true, total_attempt: 0  }, deviceinfo.id )
        if (userData.status == 4) {
            this.userService.updateUserDataByEmail({status: 1, locked_at: null}, deviceinfo.email)
        }

        return { code: 100, resp_keyword: 'Ok', userData }

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
        const { keys } = await this.redisClient.scan('0', pattern, 4)
        return keys.length
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
        const tokenData = { user_id: id, email, mobile, device_id }

        const ActiveAccCount = await this.getUserTokenCount(id)
        if ((ActiveAccCount + 1) > 3) {
            // max 3 device already have logged in...
            return { code: 4002, resp_keyword: '3deviceloggedin' }
        }

        const [access_token, refresh_token] = await Promise.all([ await this.generateToken(tokenData), await this.generateRefreshToken(tokenData)]);
        const [decoded, decoded2] = await Promise.all([await this.jwtService.decode(access_token), await this.jwtService.decode(refresh_token)])
        return {code: 100, resp_keyword: 'Ok', data : { userData: user, access_token, access_token_expires: decoded['exp'] || 7991326775, refresh_token, refresh_token_expires: decoded2['exp'] || 7991326775 }}
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