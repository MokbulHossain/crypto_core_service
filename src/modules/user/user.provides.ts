import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY} from '../../config/constants'

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
    }
];