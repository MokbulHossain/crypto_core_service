import { Injectable, Inject } from '@nestjs/common';
import {CampaignModel} from '../../models'
import {CAMPAIGN_REPOSITORY} from '../../config/constants'

@Injectable()
export class CampaignsService {

    constructor(
        @Inject(CAMPAIGN_REPOSITORY) private campaignRepository: typeof CampaignModel
    ){}
    async campaignByKeyword(keyword) {
        return await this.campaignRepository.findOne({where: {keyword}})
    }
}
