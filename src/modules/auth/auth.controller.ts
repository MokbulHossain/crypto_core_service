import { Controller, Body, Post, UseGuards, Request, Injectable,UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginAuthDto, RegisterAuthDto, ResendOTPDto, OTPValidateDto, ForgetPassAuthDto, PasswordSetAuthDto, ChangePasswordAuthDto} from '../../dto'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'
import { JwtAuthGuard } from '../../middleware/guards'
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    /**
     * 
     * check is this email already registered
     * insert into users table
     * insert into user_device table with otp
     */
    @Post('v1/registration')
    async registration(@Request() req, @Body() regbody : RegisterAuthDto) {
        const user = await this.authService.registration(regbody);
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }

    @Post('v1/login')
    async login(@Request() req, @Body() login : LoginAuthDto) {
        const user = await this.authService.validateAuth(login.email,login.password, login);
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }

    @Post('v1/resendOTP')
    async resendOTP(@Request() req, @Body() reqbody :ResendOTPDto) {
        const user = await this.authService.resendOTP(reqbody)
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
    }

    @Post('v1/validateOTP')
    async validateOTP(@Request() req, @Body() reqbody :OTPValidateDto) {
        const user = await this.authService.validateOTP(reqbody)
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }
        // userData
        const response = await this.authService.login({...user['userData'], device_id: reqbody.device_id});
        if (response.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { ...response['data'], res_message: req.i18n.__(user.resp_keyword)}
        
    }

    /**
     * 
     * validate email and then send otp in email
     * after validate goto new password set page and enter dashboard
     */
    // After password reset, all login device logout option need
    @Post('v1/forgetPassword')
    async forgetPassword(@Request() req, @Body() reqbody :ForgetPassAuthDto) {
        const user = await this.authService.forgetPassword(reqbody);
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/passwordSet')
    async passwordSet(@Request() req, @Body() reqbody :PasswordSetAuthDto) {
        const user = await this.authService.passwordSet(reqbody.newpassword, req.user['user_id'])
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
    }

    // After password reset, all login device logout option need
    @UseGuards(JwtAuthGuard)
    @Post('v1/changePassword')
    async changePassword(@Request() req, @Body() reqbody :ChangePasswordAuthDto) {
        const user = await this.authService.changePassword(reqbody.password, reqbody.newpassword, req.user['user_id'])
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/logout')
    async logout(@Request() req, @Query('all') from_all = 'false') {
        this.authService.logout(req.user['user_id'], from_all, req.user['jti'])
        return { res_message: req.i18n.__('Ok')}
    }

}