import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { CampaignsService } from '../campaigns/campaigns.service';
import { winstonLog } from '@config/winstonLog'
import { QueryTypes, Sequelize } from 'sequelize';
import {DATABASE_CONNECTION} from '../../config/constants'

@Injectable()
export class StoreService {

    constructor(
        private readonly userService: UserService, 
        private readonly campaignsService: CampaignsService,
        @Inject(DATABASE_CONNECTION) private DB: Sequelize
    ) { }
    async purchase() {

        const campaigns = await this.campaignsService.campaignByKeyword('purchase')

        // Step 2: Group campaigns by reward_type
       const groupedCampaigns = campaigns.reduce((acc, campaign) => {
        const rewardType = campaign.reward_type;
  
        if (!acc[rewardType]) {
          acc[rewardType] = [];
        }
  
        acc[rewardType].push(campaign);
  
        return acc
      }, {})

      if (!groupedCampaigns['champain']) {
        groupedCampaigns['champain'] = []
      }
      if (!groupedCampaigns['hero']) {
        groupedCampaigns['hero'] = []
      }
      if (!groupedCampaigns['gems']) {
        groupedCampaigns['gems'] = []
      }

      return groupedCampaigns
    }

    async redeemCodeUsed(redeem_code, used_by) {
        
        const query = `update redeem_codes set used = true, used_by =:used_by, used_at =:used_at where code =:redeem_code `
        this.DB.query(query, { replacements:{redeem_code, used_by, used_at: new Date()}, type: QueryTypes.SELECT})
    }
    async redeem(user_id, redeem_code) {

        const query = `select * from campaign_code_view where redeem_code =:redeem_code limit 1`
        const campaign = await this.DB.query(query, { replacements:{redeem_code}, type: QueryTypes.SELECT})
        if (campaign.length == 0){
            winstonLog.log('info', 'No Campaign Found For Redeem Code', { label: 'Campaign', transactionid_for_log: user_id })
            return { code: 400, resp_keyword: 'RedeemCodeNotFoundOrUsed' }
        }
        const reward_type = campaign[0]['reward_type'] //champain/hero/gems
        const reward_amount = campaign[0]['reward_amount']

        this.redeemCodeUsed(redeem_code, user_id)
        await this.userService.addUserCoin(user_id, reward_amount, reward_type, `${reward_type} => ${campaign[0]['title']}, redeem_code = ${redeem_code}`)

        return { code: 100, resp_keyword: 'Ok' }
    }


}
