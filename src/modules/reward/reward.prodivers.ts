import { DailyRewardClaimedMapModel, DailySpinClaimedMapModel } from '../../models'
import { DAILY_REWARD_CLAIMED_MAP_REPOSITORY, DAILY_SPIN_CLAIMED_MAP_REPOSITORY } from '../../config/constants'


export const RewardProviders = [
    {
        provide: DAILY_REWARD_CLAIMED_MAP_REPOSITORY,
        useValue: DailyRewardClaimedMapModel
    },
    {
        provide: DAILY_SPIN_CLAIMED_MAP_REPOSITORY,
        useValue: DailySpinClaimedMapModel
    }
]