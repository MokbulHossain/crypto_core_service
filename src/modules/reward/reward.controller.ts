import { Controller, Get, UseGuards, Request, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../middleware/guards'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'
import { SpinClaimDto } from '../../dto'
import { RewardService } from './reward.service'

@Controller('reward')
export class RewardController {

    constructor(private readonly rewardService: RewardService) {}

    @UseGuards(JwtAuthGuard)
    @Post('watch-ad')
    async watchAd(@Request() req, @Body() reqdata) {
        
        const user = await this.rewardService.watchAd(req.user['user_id'])
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('daily_reward')
    async dailyReward(@Request() req ) {
        
       return await this.rewardService.dailyReward(req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('claimed/daily_reward')
    async dailyRewardClaim(@Request() req, @Body() reqdata) {
        
        const user = await this.rewardService.dailyRewardClaim(req.user['user_id'])
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('daily_spin')
    async dailySpin(@Request() req ) {
        
       return await this.rewardService.dailySpin(req.user['user_id'])
        
    }

    @UseGuards(JwtAuthGuard)
    @Post('claimed/daily_spin')
    async dailySpinClaim(@Request() req, @Body() reqdata: SpinClaimDto) {
        
        const user = await this.rewardService.dailySpinClaim(req.user['user_id'], reqdata.spin_id)
       
        if (user.code !== 100) {

            throw new BadRequestException(BAD_REQUEST(req.i18n.__(user.resp_keyword),null,req))
        }

        return { res_message: req.i18n.__(user.resp_keyword)}
        
    }
}
