import { Injectable , Inject} from '@nestjs/common';
import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel, UserTempModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY, USER_TEMP_REPOSITORY} from '../../config/constants'

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof UserModel,
        @Inject(USER_TEMP_REPOSITORY) private readonly userTempRepository: typeof UserTempModel,
        @Inject(USER_DEVICE_REPOSITORY) private readonly userDeviceRepository: typeof UserDeviceModel,
        @Inject(PASSWORD_CONFIG_REPOSITORY) private readonly passwordRepository: typeof PasswordConfigModel,
        @Inject(PROTOCOL_REPOSITORY) private readonly protocolRepository: typeof ProtocolModel,
        @Inject(COUNTRIES_REPOSITORY) private readonly countriesRepository: typeof CountriesModel,


    ) { }

    async getSingleuser( email ){

        return await this.userRepository.findOne({ where: { email }})
    }

    async getSingleTempuser( email ){

        return await this.userTempRepository.findOne({ where: { email }, order: [['id', 'desc']]})
    }

    async deleteTempuser( email ){

        return await this.userTempRepository.destroy({ where: { email }})
    }
    
    async tempcreate( data ){

        return await this.userTempRepository.create(data)
    }

    async create( data ){

        return await this.userRepository.create(data)
    }

    async updateUserData( data, id ){

        return await this.userRepository.update(data, {
            where : { id }
        })
    }

    async updateUserDataByEmail( data, email ){

        return await this.userRepository.update(data, {
            where : { email }
        })
    }

    async createDeviceLog( data ){

        return await this.userDeviceRepository.create(data)
    }

    async getDeviceLog( data ){

        return await this.userDeviceRepository.findOne({
            where: {
                email: data['email'],
                device_id: data['device_id'],
            },
            order: [['id', 'desc']]
        })
    }

    async updateDeviceLog( data, id ){

        return await this.userDeviceRepository.update(data, {
            where : { id }
        })
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
