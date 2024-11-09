import { Controller, Body, Post, UseGuards, Request, Injectable,UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginAuthDto, RegisterAuthDto} from '../../dto'
import {UNAUTHORIZED} from '../../helpers/responseHelper'

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
        
    }

    @Post('v1/login')
    async login(@Request() req, @Body() login : LoginAuthDto) {
        const user = await this.authService.validateAuth(login.email,login.password);
        if (!user) {
         throw new UnauthorizedException(UNAUTHORIZED(req.i18n.__('invalidusercredentials'),req));
        }
        const response = await this.authService.login(user);
        if (!response) {
            throw new UnauthorizedException(UNAUTHORIZED(req.i18n.__('maxdeviceactive'),req));
        }

        return response
        
    }

    @Post('v1/resendOTP')
    async resendOTP(@Request() req, @Body() login :LoginAuthDto) {
        
    }

    @Post('v1/validateOTP')
    async validateOTP(@Request() req, @Body() login :LoginAuthDto) {

        
    }

    /**
     * 
     * validate email and then send otp in email
     * after validate goto new password set page and enter dashboard
     */
    // After password reset, all login device logout option need
    @Post('v1/forgetPassword')
    async forgetPassword(@Request() req, @Body() login :LoginAuthDto) {
        
    }

    @Post('v1/passwordSet')
    async passwordSet(@Request() req, @Body() login :LoginAuthDto) {

        
    }

    // After password reset, all login device logout option need
    @Post('v1/changePassword')
    async changePassword(@Request() req, @Body() login :LoginAuthDto) {
        
    }

}