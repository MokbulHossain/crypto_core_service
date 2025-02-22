import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { SignalService } from './signal.service'
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'
import { SignalCreateDto, SignalListDto, SignalUnlockDto, SignalDeleteDto } from '../../dto'

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

    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async delete(@Request() req, @Body() reqdata: SignalDeleteDto) {
        
       const data =  await this.signalService.delete(req.user['user_id'], reqdata)
       if (data.code !== 100) {

        throw new BadRequestException(BAD_REQUEST(req.i18n.__(data.resp_keyword),null,req))
    }

    return { res_message: req.i18n.__(data.resp_keyword)}
        
   }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async list(@Request() req, @Query() reqdata: SignalListDto) {
        
        return await this.signalService.list(req.user['user_id'], +(reqdata['page'] || 1), +(reqdata['limit'] || 10), reqdata)
       
    }

    @UseGuards(JwtAuthGuard)
    @Get('targets')
    async targets(@Request() req, @Query() reqdata: SignalUnlockDto) {
        
        return await this.signalService.targets(reqdata['signal_id'])
       
    }

    @UseGuards(JwtAuthGuard)
    @Post('unlock')
    async unlock(@Request() req, @Body() reqdata: SignalUnlockDto) {
        
       return await this.signalService.unlock(req.user['user_id'], reqdata['signal_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('unlock/list')
    async unlockList(@Request() req, @Query() reqdata: SignalListDto) {
        
       return await this.signalService.unlockList(req.user['user_id'], +(reqdata['page'] || 1), +(reqdata['limit'] || 10), reqdata)

        
    }
}
