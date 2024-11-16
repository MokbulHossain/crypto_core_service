import { Injectable , Inject} from '@nestjs/common';
import {UserModel, UserDeviceModel, PasswordConfigModel, ProtocolModel, CountriesModel, UserTempModel, HeroListViewModel, 
    FollowingHeroListViewModel, FollowerMapModel, SubscriberMapModel} from '../../models'
import {USER_REPOSITORY, USER_DEVICE_REPOSITORY, PASSWORD_CONFIG_REPOSITORY, PROTOCOL_REPOSITORY, COUNTRIES_REPOSITORY, 
    USER_TEMP_REPOSITORY, HEROLISTVIEW_REPOSITORY, FOLLOWINGHEROLISTVIEW_REPOSITORY, FOLLOWERMAP_REPOSITORY,SUBSCRIBERMAP_REPOSITORY} from '../../config/constants'

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
        @Inject(FOLLOWINGHEROLISTVIEW_REPOSITORY) private readonly followingheroRepository: typeof FollowingHeroListViewModel,
        @Inject(FOLLOWERMAP_REPOSITORY) private readonly followermapRepository: typeof FollowerMapModel,
        @Inject(SUBSCRIBERMAP_REPOSITORY) private readonly subscribermapRepository: typeof SubscriberMapModel,

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

    async userDetails(user_id) {

        return await this.userRepository.findOne({attributes: { exclude: ['password'] }, where : { id: user_id}})
    }

    async heroDetails(user_id, hero_id) {

        const [userData, follower, subscriber] = await Promise.all([
            this.heroRepository.findOne({
                where : { user_id: hero_id}
            }),
    
            this.followermapRepository.findOne({
                where : { user_id, follower_id: hero_id }
            }),
    
            this.subscribermapRepository.findOne({
                where : { user_id, subscriber_id: hero_id }
            })
        ])

        return {
            ...userData['dataValues'],
            follow: follower ? true : false,
            subscribe: subscriber ? true : false
        }

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

    async followingherolist(page, limit, search, user_id) {

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
        return await this.followingheroRepository.findAll({
            where: {...conditions, user_id},
            offset: (page - 1) * limit,
            limit,
            order: [['follow_at', 'desc']]
        })
    }

    async follow(user_id, follower_id) {

        const findMap = await this.followermapRepository.findOne({ where: { user_id, follower_id}})
        if (findMap) {
            return { code: 4002, resp_keyword: 'followermapexist' }
        }
        await this.followermapRepository.create({
            user_id,
            follower_id
        })

        return { code: 100, resp_keyword: 'Ok' }
    }
}
