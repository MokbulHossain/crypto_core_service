import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service'
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}
   
    @Get('passwordConfig')
    async passwordConfig() {
        
        return await this.userService.passwordConfig()
        
    }

    @Get('countries')
    async counties() {
        
        return await this.userService.counties()
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('mydetails')
    async myDetails(@Request() req, @Query() reqdata) {
        
        return await this.userService.userDetails(req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('referInfo')
    async referInfo(@Request() req) {
        
        return await this.userService.referInfo(req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('referInfo')
    async createReferInfo(@Request() req, @Body() reqdata) {
        
        return await this.userService.createReferInfo(req.user['user_id'], reqdata['refer_code'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('herodetails')
    async heroDetails(@Request() req, @Query() reqdata) {
        
        return await this.userService.heroDetails(req.user['user_id'], reqdata['user_id'] || -1)
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('herolistpagedata')
    async herolistpagedata(@Request() req) {
        
        return await this.userService.herolistpagedata()
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('herolist')
    async herolist(@Request() req, @Query() reqdata) {
        
        return await this.userService.herolist(reqdata['page'] || 1, reqdata['limit'] || 10, reqdata['search'] || null)
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('followingherolist')
    async followingherolist(@Request() req, @Query() reqdata) {
        
        return await this.userService.followingherolist(reqdata['page'] || 1, reqdata['limit'] || 10, reqdata['search'] || null, req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('subscribeherolist')
    async subscribeherolist(@Request() req, @Query() reqdata) {
        
        return await this.userService.subscribeherolist(reqdata['page'] || 1, reqdata['limit'] || 10, reqdata['search'] || null, req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('follow')
    async follow(@Request() req, @Body() reqdata) {
        
        const user = await this.userService.follow(req.user['user_id'], reqdata['follower_id'])
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('subscribe')
    async subscribe(@Request() req, @Body() reqdata) {
        
        const user = await this.userService.subscribe(req.user['user_id'], reqdata['subscriber_id'])
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }
}
