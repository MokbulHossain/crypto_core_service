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
}