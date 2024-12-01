import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { SignalService } from './signal.service'
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'

@Controller('signal')
export class SignalController {

    constructor(private signalService: SignalService) {}

    @UseGuards(JwtAuthGuard)
    @Get('create_signal_config')
    async signalConfig(@Request() req, @Body() reqdata) {
        
        return await this.signalService.signalConfig()
       
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() reqdata) {
        
        // const user = await this.signalService.create(req.user['user_id'], reqdata)
       
        // if (user.code !== 100) {

        //     throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        // }

        // return { res_message: req.i18n.__(user.resp_keyword)}
        
    }
}
