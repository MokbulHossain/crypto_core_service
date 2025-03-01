import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { CampaignsService } from '../campaigns/campaigns.service';
import { winstonLog } from '@config/winstonLog'
import { DATABASE_CONNECTION, DAILY_REWARD_CLAIMED_MAP_REPOSITORY } from '../../config/constants'
import { QueryTypes, Sequelize } from 'sequelize';
import { DailyRewardClaimedMapModel } from '../../models'

@Injectable()
export class RewardService {

    constructor(
        private readonly userService: UserService, 
        private readonly campaignsService: CampaignsService,
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        @Inject(DAILY_REWARD_CLAIMED_MAP_REPOSITORY) private dailyRewardClaimedMapRepository: typeof DailyRewardClaimedMapModel
    ) { }

    async watchAd(user_id) {

        const campaigns = await this.campaignsService.campaignByKeyword('watchad');
        if (!campaigns.length){
            winstonLog.log('info', 'No Campaign Found For Watch Ad', { label: 'Campaign', transactionid_for_log: user_id })
            return { code: 100, resp_keyword: 'Ok' }
        }

        let campaign = campaigns[0]

        this.userService.addUserCoin(user_id, campaign.reward_amount, campaign.reward_type, `${campaign.type} => ${campaign.title}`)

        return { code: 100, resp_keyword: 'Ok' }
    }

    async dailyReward(user_id) {

        return await this.DB.query(`select * from daily_reward_claimed_list(:user_id)`, { replacements:{user_id}, type: QueryTypes.SELECT})
    }

    async dailyRewardClaim(user_id) {

        const data = await this.DB.query(`select * from daily_reward_claimed_list(:user_id)`, { replacements:{user_id}, type: QueryTypes.SELECT})
        let claimedData = null
        data.map(item => {
            item['isclamable'] == true ? claimedData = item : null
        })

        if (claimedData) {

            this.userService.addUserCoin(user_id, claimedData.reward_amount, claimedData.reward_type, `${claimedData.type} => ${claimedData.title}`)
            await this.dailyRewardClaimedMapRepository.create({
                user_id: user_id,
                campaign_id: claimedData.id,
                day_no: claimedData.day_no,
                reward_type: claimedData.reward_type,
                reward_amount: claimedData.reward_amount
            })
            return { code: 100, resp_keyword: 'Ok' }
        }
        else {
            winstonLog.log('info', 'No Campaign Found For Daily Reward', { label: 'Campaign', transactionid_for_log: user_id })
            return { code: 400, resp_keyword: 'No Campaign Found For Daily Reward' }
        }
    }
}
