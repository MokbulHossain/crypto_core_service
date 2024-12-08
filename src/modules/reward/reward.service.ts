import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { CampaignsService } from '../campaigns/campaigns.service';
import { winstonLog } from '@config/winstonLog'

@Injectable()
export class RewardService {

    constructor(
        private readonly userService: UserService, 
        private readonly campaignsService: CampaignsService
    ) { }

    async watchAd(user_id) {

        const campaign = await this.campaignsService.campaignByKeyword('watchad');
        if (!campaign){
            winstonLog.log('info', 'No Campaign Found For Watch Ad', { label: 'Campaign', transactionid_for_log: user_id })
            return { code: 100, resp_keyword: 'Ok' }
        }

        this.userService.addUserCoin(user_id, campaign.reward_amount, campaign.reward_type, `${campaign.type} => ${campaign.title}`)

        return { code: 100, resp_keyword: 'Ok' }
    }
}
