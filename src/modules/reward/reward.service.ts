import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { CampaignsService } from '../campaigns/campaigns.service';
import { winstonLog } from '@config/winstonLog'
import { DATABASE_CONNECTION, DAILY_REWARD_CLAIMED_MAP_REPOSITORY, DAILY_SPIN_CLAIMED_MAP_REPOSITORY } from '../../config/constants'
import { QueryTypes, Sequelize, Op } from 'sequelize';
import { DailyRewardClaimedMapModel, DailySpinClaimedMapModel } from '../../models'
import  moment from 'moment'

@Injectable()
export class RewardService {

    constructor(
        private readonly userService: UserService, 
        private readonly campaignsService: CampaignsService,
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        @Inject(DAILY_REWARD_CLAIMED_MAP_REPOSITORY) private dailyRewardClaimedMapRepository: typeof DailyRewardClaimedMapModel,
        @Inject(DAILY_SPIN_CLAIMED_MAP_REPOSITORY) private dailySpinClaimedMapModel: typeof DailySpinClaimedMapModel

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

    async dailySpin(user_id) {  

        let campaignPlusSpinConfig = [], haveCampaignPlusSpin = false, campaignPlusSpinCount = 0

        const [userData, dailySpin, spinConfig] = await Promise.all([
            this.userService.getSingleuserchampionPlusExpiryById( user_id ),
            this.dailySpinClaimedMapModel.findOne({ where: { user_id, spin_type:'spin', created_at: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } }, order: [['id', 'desc']] }),
            this.campaignsService.campaignByKeyword('dailyspin')
        ])

        if (!spinConfig.length){
            winstonLog.log('info', 'No Campaign Found For Daily Spin', { label: 'Campaign', transactionid_for_log: user_id })
            return { code: 400, resp_keyword: 'No Campaign Found For Daily Spin' }
        }

        if (userData.champion_plus_spin_expiry) {
            const expiryDate = moment(userData.champion_plus_spin_expiry);
            const today = moment().startOf('day'); // Start of the current day
        
            if (expiryDate.isSame(today) || expiryDate.isAfter(today)) {
                haveCampaignPlusSpin = true
                let [campaignPlusSpinConf, dailycampaignPlusSpin] = await Promise.all([
                        this.campaignsService.campaignByKeyword('campaignplusdailyspin'),
                        this.dailySpinClaimedMapModel.findOne({ where: { user_id, spin_type:'campaign_plus', created_at: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } }, order: [['id', 'desc']] }),
                    ])
    
                campaignPlusSpinConfig = campaignPlusSpinConf
                campaignPlusSpinCount = dailycampaignPlusSpin ? dailycampaignPlusSpin.rest_spin : 2
            } 
            else {
                // Expired (before today)
                winstonLog.log('info', 'Champion Plus Spin Expired', { label: 'Campaign', transactionid_for_log: user_id });
            }
        } else {
            // Handle case where champion_plus_spin_expiry is null or undefined
            winstonLog.log('warn', 'champion_plus_spin_expiry is null or undefined', { label: 'Campaign', transactionid_for_log: user_id });
        }


        return {
            spinConfig,
            spinCount: dailySpin ? dailySpin.rest_spin : 2,
            haveCampaignPlusSpin,
            campaignPlusSpinConfig,
            campaignPlusSpinCount
        }

    }
}
