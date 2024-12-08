import {CampaignModel} from '../../models'
import {CAMPAIGN_REPOSITORY} from '../../config/constants'

export const CampaignProviders = [
    {
        provide: CAMPAIGN_REPOSITORY,
        useValue: CampaignModel
    }
]