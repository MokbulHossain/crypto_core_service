import { Injectable , Inject} from '@nestjs/common';
import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel, UserTempModel, HeroListViewModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY, USER_TEMP_REPOSITORY, HEROLISTVIEW_REPOSITORY} from '../../config/constants'

import { Op } from 'sequelize';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof UserModel,
        @Inject(USER_TEMP_REPOSITORY) private readonly userTempRepository: typeof UserTempModel,
        @Inject(USER_DEVICE_REPOSITORY) private readonly userDeviceRepository: typeof UserDeviceModel,
        @Inject(PASSWORD_CONFIG_REPOSITORY) private readonly passwordRepository: typeof PasswordConfigModel,
        @Inject(PROTOCOL_REPOSITORY) private readonly protocolRepository: typeof ProtocolModel,
        @Inject(COUNTRIES_REPOSITORY) private readonly countriesRepository: typeof CountriesModel,
        @Inject(HEROLISTVIEW_REPOSITORY) private readonly heroRepository: typeof HeroListViewModel,


    ) { }

    async getSingleuser( email ){

        return await this.userRepository.findOne({ where: { email }})
    }

    async getSingleuserById( id ){

        return await this.userRepository.findOne({ where: { id }})
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

    async herolist(page, limit, search) {

        let conditions = {}
        if (search) {
            const isNumeric = /^\d+$/.test(search); // Check if the search contains only digits
            if (isNumeric) {
                conditions = {
                    [Op.or]: [
                      { name: { [Op.iLike]: `%${search}%` } },
                      { email: { [Op.iLike]: `%${search}%` } },
                      { mobile: { [Op.iLike]: `%${search}%` } },
                    ]
                }
            } else {
                conditions = {
                    [Op.or]: [
                      { name: { [Op.iLike]: `%${search}%` } },
                      { email: { [Op.iLike]: `%${search}%` } }                    
                    ]
                }
            }
        }
        return await this.heroRepository.findAll({
            where: conditions,
            offset: (page - 1) * limit,
            limit,
            order: [['user_id', 'desc']]
        })
    }
}
