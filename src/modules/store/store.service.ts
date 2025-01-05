import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { CampaignsService } from '../campaigns/campaigns.service';
import { winstonLog } from '@config/winstonLog'

@Injectable()
export class StoreService {

    constructor(
        private readonly userService: UserService, 
        private readonly campaignsService: CampaignsService
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
}
