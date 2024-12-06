import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { SignalService } from './signal.service'
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'
import { SignalCreateDto } from '../../dto'

@Controller('signal')
export class SignalController {

    constructor(private signalService: SignalService) {}

    @UseGuards(JwtAuthGuard)
    @Get('create_signal_config')
    async signalConfig(@Request() req, @Body() reqdata) {
        
        return await this.signalService.signalConfig()
       
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('coin_price')
    async coinPrice(@Request() req, @Body() reqdata) {
        
       return await this.signalService.coinPrice(reqdata['coin_name'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() reqdata: SignalCreateDto) {
        
       return await this.signalService.create(req.user['user_id'], reqdata)
        
    }
}
