import { Injectable , Inject} from '@nestjs/common';
import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY} from '../../config/constants'

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof UserModel,
        @Inject(USER_DEVICE_REPOSITORY) private readonly userDeviceRepository: typeof UserDeviceModel,
        @Inject(PASSWORD_CONFIG_REPOSITORY) private readonly passwordRepository: typeof PasswordConfigModel,
        @Inject(PROTOCOL_REPOSITORY) private readonly protocolRepository: typeof ProtocolModel,
        @Inject(COUNTRIES_REPOSITORY) private readonly countriesRepository: typeof CountriesModel,


    ) { }

    async getSingleser( email ){

        return await this.userRepository.findOne({ where: { email }})
    }
    
    async create( data ){

        return await this.userRepository.create(data)
    }

    async createDeviceLog( data ){

        return await this.userDeviceRepository.create(data)
    }

    async passwordConfig() {
        return await this.passwordRepository.findOne()
    }

    async protocol() {
        return await this.protocolRepository.findOne()
    }

    async counties() {
        return await this.countriesRepository.findAll()
    }
}
