import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel, UserTempModel, HeroListViewModel, 
    FollowingHeroListViewModel, FollowerMapModel, SubscriberMapModel, SubscribeHeroListViewModel, UserReferMapListviewModel,
    UserReferMapModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY, 
    USER_TEMP_REPOSITORY, HEROLISTVIEW_REPOSITORY, FOLLOWINGHEROLISTVIEW_REPOSITORY, FOLLOWERMAP_REPOSITORY,SUBSCRIBERMAP_REPOSITORY,
    SUBSCRIBEHEROLISTVIEW_REPOSITORY, USER_REFERLISTVIEW_REPOSITORY, USER_REFERMAP_REPOSITORY} from '../../config/constants'

export const UserProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: UserModel
    },

    {
        provide: USER_DEVICE_REPOSITORY,
        useValue: UserDeviceModel
    },
    {
        provide: PASSWORD_CONFIG_REPOSITORY,
        useValue: PasswordConfigModel
    },

    {
        provide: PROTOCOL_REPOSITORY,
        useValue: ProtocolModel
    },
    {
        provide: COUNTRIES_REPOSITORY,
        useValue: CountriesModel
    },
    {
        provide: USER_TEMP_REPOSITORY,
        useValue: UserTempModel 
    },
    {
        provide: HEROLISTVIEW_REPOSITORY,
        useValue: HeroListViewModel 
    },
    {
        provide: FOLLOWINGHEROLISTVIEW_REPOSITORY,
        useValue: FollowingHeroListViewModel 
    },
    {
        provide: SUBSCRIBEHEROLISTVIEW_REPOSITORY,
        useValue: SubscribeHeroListViewModel 
    },
    {
        provide: FOLLOWERMAP_REPOSITORY,
        useValue: FollowerMapModel 
    },
    {
        provide: SUBSCRIBERMAP_REPOSITORY,
        useValue: SubscriberMapModel 
    },
    {
        provide: USER_REFERLISTVIEW_REPOSITORY,
        useValue: UserReferMapListviewModel 
    },
    {
        provide: USER_REFERMAP_REPOSITORY,
        useValue: UserReferMapModel 
    }
];