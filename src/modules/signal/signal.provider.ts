import {SignalModel, SignalTargetModel, CoinTypeModel, SignalViewModel, SignalUnlockMapModel, SignalTargetHistoryModel, SignalHistoryModel} from '../../models'
import {SIGNAL_REPOSITORY, SIGNAL_TARGET_REPOSITORY, COINTYPE_REPOSITORY, SIGNALVIEW_REPOSITORY, SIGNALUNLOKMAP_REPOSITORY, SIGNAL_TARGET_HISTORY_REPOSITORY, SIGNAL_HISTORY_REPOSITORY} from '../../config/constants'

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
    },
    {
        provide: SIGNALVIEW_REPOSITORY,
        useValue: SignalViewModel
    },
    {
        provide: SIGNALUNLOKMAP_REPOSITORY,
        useValue: SignalUnlockMapModel
    },
    {
        provide: SIGNAL_TARGET_HISTORY_REPOSITORY,
        useValue: SignalTargetHistoryModel
    },
    {
        provide: SIGNAL_HISTORY_REPOSITORY,
        useValue: SignalHistoryModel
    }
]