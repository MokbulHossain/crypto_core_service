import { DailyRewardClaimedMapModel } from '../../models'
import { DAILY_REWARD_CLAIMED_MAP_REPOSITORY } from '../../config/constants'


export const RewardProviders = [
    {
        provide: DAILY_REWARD_CLAIMED_MAP_REPOSITORY,
        useValue: DailyRewardClaimedMapModel
    }
]