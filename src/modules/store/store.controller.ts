import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'

import { StoreService } from './store.service'

@Controller('store')
export class StoreController {

    constructor(private readonly storeService: StoreService) {}

    @UseGuards(JwtAuthGuard)
    @Get('coin_prices')
    async purchase(@Request() req, @Body() reqdata) {
        
        return await this.storeService.purchase()
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('redeem')
    async redeem(@Request() req, @Body() reqdata) {   

        const response = await this.storeService.redeem(req.user['user_id'], reqdata['redeem_code'])
       
        if (response.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(response.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(response.resp_keyword)}
    }
}