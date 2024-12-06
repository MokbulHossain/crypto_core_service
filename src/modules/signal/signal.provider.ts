import {SignalModel, SignalTargetModel, CoinTypeModel} from '../../models'
import {SIGNAL_REPOSITORY, SIGNAL_TARGET_REPOSITORY, COINTYPE_REPOSITORY} from '../../config/constants'

export const SignalProviders = [
    {
        provide: SIGNAL_REPOSITORY,
        useValue: SignalModel
    },
    {
        provide: SIGNAL_TARGET_REPOSITORY,
        useValue: SignalTargetModel
    },
    {
        provide: COINTYPE_REPOSITORY,
        useValue: CoinTypeModel
    }
]