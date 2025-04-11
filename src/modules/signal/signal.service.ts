import { Injectable , Inject, BadRequestException} from '@nestjs/common';
import { Op } from 'sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../../config/constants'
import {SignalModel, SignalTargetModel, CoinTypeModel, SignalViewModel, SignalUnlockMapModel, SignalHistoryModel, SignalTargetHistoryModel} from '../../models'
import {REDIS_CONNECTION, SIGNAL_REPOSITORY, SIGNAL_TARGET_REPOSITORY, COINTYPE_REPOSITORY, SIGNALVIEW_REPOSITORY, 
   SIGNALUNLOKMAP_REPOSITORY, SIGNAL_TARGET_HISTORY_REPOSITORY, SIGNAL_HISTORY_REPOSITORY} from '../../config/constants'
import { SignalCreateDto, SignalEditDto } from '../../dto'
import axios from 'axios'
import { winstonLog } from '@config/winstonLog'
import { UserService } from '../user/user.service'

@Injectable()
export class SignalService {
    constructor(

        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        @Inject(REDIS_CONNECTION) private redisClient: any,
        @Inject(SIGNAL_REPOSITORY) private readonly signalRepository: typeof SignalModel,
        @Inject(SIGNAL_TARGET_REPOSITORY) private readonly signalTargetRepository: typeof SignalTargetModel,

        @Inject(SIGNAL_HISTORY_REPOSITORY) private readonly signalHistoryRepository: typeof SignalHistoryModel,
        @Inject(SIGNAL_TARGET_HISTORY_REPOSITORY) private readonly signalTargetHistoryRepository: typeof SignalTargetHistoryModel,

        @Inject(COINTYPE_REPOSITORY) private readonly cointypeRepository: typeof CoinTypeModel,
        @Inject(SIGNALVIEW_REPOSITORY) private readonly signalviewRepository: typeof SignalViewModel,
        @Inject(SIGNALUNLOKMAP_REPOSITORY) private readonly signalunlockmapRepository: typeof SignalUnlockMapModel,
        private readonly userService: UserService

    ) { }

    async signalConfig() {

      const coinType = await this.cointypeRepository.findAll({where: {status: 1}})
        const payload = {
            "coin_types":coinType,
            "leverage": [5,10,20],
            "config":{
               "spot":{
                  "entry_price":{
                     "compare":"current_price",
                     "min_perc":95,
                     "max_perc":99.85
                  },
                  "stop_loss":{
                     "compare":"entry_price",
                     "min_perc":85,
                     "max_perc":99
                  },
                  "target_1":{
                     "compare":"entry_price",
                     "min_perc":103,
                     "max_perc":110
                  },
                  "target_2":{
                     "compare":"entry_price",
                     "min_perc":105,
                     "max_perc":120
                  },
                  "target_3":{
                     "compare":"entry_price",
                     "min_perc":107,
                     "max_perc":130
                  }
               },
               "long":{
                  "entry_price":{
                     "compare":"current_price",
                     "min_perc":97,
                     "max_perc":99.85
                  },
                  "stop_loss":{
                     "compare":"entry_price",
                     "min_perc":95,
                     "max_perc":99
                  },
                  "target_1":{
                     "compare":"entry_price",
                     "min_perc":102,
                     "max_perc":105
                  },
                  "target_2":{
                     "compare":"entry_price",
                     "min_perc":103,
                     "max_perc":110
                  },
                  "target_3":{
                     "compare":"entry_price",
                     "min_perc":104,
                     "max_perc":115
                  }
               },
               "short":{
                  "entry_price":{
                     "compare":"current_price",
                     "min_perc":100.15,
                     "max_perc":105
                  },
                  "stop_loss":{
                     "compare":"entry_price",
                     "min_perc":101,
                     "max_perc":115
                  },
                  "target_1":{
                     "compare":"entry_price",
                     "min_perc":95,
                     "max_perc":98
                  },
                  "target_2":{
                     "compare":"entry_price",
                     "min_perc":90,
                     "max_perc":97
                  },
                  "target_3":{
                     "compare":"entry_price",
                     "min_perc":85,
                     "max_perc":96
                  }
               }
            }
        }

        return payload
    }

    async coinPrice(coin_name) {

      const redisData = await this.redisClient.get(`coin_price:${coin_name}`)
      if (redisData) {
         return (+redisData)
      }
      console.log('Didnot find in redis.')
      const url = process.env.PRICE_API_URL.replace(/<COIN_NAME>/g, coin_name)
      console.log(url)
      return await axios.get(url)
         .then(resp => {
            const respData = resp.data
            console.log('respData => ', respData)
            this.redisClient.setEx(`coin_price:${coin_name}`, 5, (respData['price']))
            return (+respData['price'])

         }).catch(e => {
            const errorResponse = e['response'] ? (e['response']['data'] ? e['response']['data'] : e['response']) : e
            winstonLog.log('error', `${url} api Response %o`, errorResponse);
            return 0
         })
    }

    async create(user_id, reqdata: SignalCreateDto) {

      const id = Date.now()
      // Ascending order
      // const sortData = reqdata.signal_targets.sort((a, b) => a - b)
      const targetData = reqdata.signal_targets.map(item => ({signal_id: id, target: item}))

      Promise.all([
         this.signalRepository.create({...reqdata, id, user_id}),
         this.signalTargetRepository.bulkCreate(targetData)
      ])

      return true
    }

    async edit(user_id, reqdata: SignalEditDto) {

      const signal_id = reqdata.signal_id
      const data = await this.signalRepository.findOne({where : { id: signal_id , user_id}})
      if (!data) {
         return {code: 400, resp_keyword: 'Signal is not exist'}
      }
      if (data.status != 1) {
         return {code: 400, resp_keyword: 'Signal is not in pending state'}
      }
      // Ascending order
      // const sortData = reqdata.signal_targets.sort((a, b) => a - b)
      const targetData = reqdata.signal_targets.map(item => ({signal_id, target: item}))

      await this.signalTargetRepository.destroy({where : { signal_id }})

      await Promise.all([
         this.signalRepository.update({...reqdata}, {where : { id: signal_id} }),
         this.signalTargetRepository.bulkCreate(targetData)
      ])

      return {code: 100, resp_keyword: 'Signal edited successfully'}
    }

   /**
    *  “hero”_id: 1,
   "package_type": "Free",
    "signal_type": "Soot",
    “status”: 0 => for all
    * @param user_id 
    * @param page 
    * @param limit 
    * @returns 
    */
    async list(user_id, page, limit, reqdata) {

      const only_unlocked = reqdata['only_unlocked'] || false
      if (only_unlocked && (only_unlocked == 'true' || only_unlocked == 'True' || only_unlocked == true)) {
         return await this.unlockList(user_id, page, limit, reqdata)
      }
      const hero_id = reqdata['hero_id'] || user_id
   
      const conditions = {hero_id}

      if (reqdata['status'] != 0) {
         conditions['status'] = (+reqdata['status'])
      }
      if (reqdata['signal_type'] !== 'All') {
         conditions['signal_type'] = reqdata['signal_type']
      }
      if (reqdata['package_type'] !== 'All') {
         conditions['package_type'] = reqdata['package_type']
      }

      if (reqdata['start_date'] && reqdata['end_date']) {
         reqdata['start_date'] = `${reqdata['start_date']} 00:00:00`
         reqdata['end_date'] = `${reqdata['end_date']} 23:59:59`
         conditions['created_at'] = {
            [Op.between]: [reqdata['start_date'], reqdata['end_date']]
        };
      }

      // check for my signals..
      if (user_id == hero_id) {
         return await this.signalviewRepository.findAll({
            attributes: {
               include: [[Sequelize.literal('true'), 'unlocked']],
            },
            where: {...conditions},
            offset: (page - 1) * limit,
            limit
         })
      }
      else {
         // check this hero is my subscriber or not
         const subscriber = await this.userService.checkSubscriber(user_id, hero_id)
         if (!subscriber) {
            
            if (reqdata['package_type'] == 'Premium') {
               return []
            }
            // only free signal with unlock status
            conditions['package_type'] = 'Free'

         }

         if (reqdata['start_date'] && reqdata['end_date']) {
            conditions['start_date'] = reqdata['start_date'];
            conditions['end_date'] = reqdata['end_date'];
        }

        delete conditions['created_at']

         return await this.DB.query(`select * from get_signals_with_unlock_status(_user_id :=:user_id::bigint, _hero_id :=:hero_id::bigint, _offset :=:offset, _limit :=:limit, _conditions :=:conditions::jsonb)`,{
            replacements: {
               user_id,
               hero_id,
               offset: (page - 1) * limit,
               limit,
               conditions: JSON.stringify(conditions)
            },
            type: QueryTypes.SELECT
         })
      }


    }

    async delete(user_id, reqdata) {

      const { signal_id } = reqdata
      const data = await this.signalRepository.findOne({where : { id: signal_id , user_id}})
      if (!data) {
         return {code: 400, resp_keyword: 'Signal is not exist'}
      }
      if (data.status != 1) {
         return {code: 400, resp_keyword: 'Signal is not in pending state'}
      }

      const signal_targets = await this.signalTargetRepository.findAll({
         where: {signal_id}
      })
      await Promise.all([
         this.signalHistoryRepository.create({...data['dataValues']}),
         this.signalTargetHistoryRepository.bulkCreate(signal_targets.map(item => ({...item['dataValues']})))
      ])

      await Promise.all([
         this.signalRepository.destroy({where : { id: signal_id }}),
         this.signalTargetRepository.destroy({where : { signal_id }})
      ])

      return {code: 100, resp_keyword: 'Signal deleted successfully'}

    }
    async unlockList(user_id, page, limit, reqdata) {

      const hero_id = reqdata['hero_id'] || user_id
   
      let conditions = {}

      if (reqdata['status'] != 0) {
         conditions['status'] = (+reqdata['status'])
      }
      if (reqdata['signal_type'] !== 'All') {
         conditions['signal_type'] = reqdata['signal_type']
      }
      if (reqdata['package_type'] !== 'All') {
         conditions['package_type'] = reqdata['package_type']
      }

      if (reqdata['start_date'] && reqdata['end_date']) {

         conditions['start_date'] = `${reqdata['start_date']} 00:00:00`
         conditions['end_date'] = `${reqdata['end_date']} 23:59:59`
     }
         
      return await this.DB.query(`select * from get_unlock_signals(_user_id :=:user_id::bigint, _offset :=:offset, _limit :=:limit, _conditions :=:conditions::jsonb)`,{
         replacements: {
            user_id,
            offset: (page - 1) * limit,
            limit,
            conditions: JSON.stringify(conditions)
         },
         type: QueryTypes.SELECT
      })
    }
    async targets(signal_id) {
      // select coin_name from signal_view where id = ;
      const [signaldata, targetdata] = await Promise.all([
         this.signalviewRepository.findOne({
            attributes: ['coin_name'],
            where: {id: signal_id}
         }),
         this.signalTargetRepository.findAll({
            attributes: ['target', 'status'],
            where: {signal_id},
            order: [['id', 'ASC']]
         })
      ])

      const coinCurrentPrice = await this.coinPrice(signaldata.coin_name)

      return {
         current_price: coinCurrentPrice,
         targets: targetdata
      }


    }

    /**
     * 
     * Signal unlock logic⇒
         1. Closed signal always will be open for all user and all type(free, premium) , doesn’t matter on subscribe or not
         2. Unlock price can be change from db(all type signal , for all user will be same price)
         3. Unsubscribe user also can see all type of signal(free, premium) in list
         4. Free signal anyone can unlock with champion coin but subscribe user will get free
         5. Premium signal only unlockable by subscribe user only with free coin
     */
    async unlock(user_id, signal_id) {

      let unlocked_price = 600
      const data = await this.signalRepository.findOne({where : { id: signal_id}})
      if (!data) {
         throw  new BadRequestException('Signal is not exist')
         // return {code: 400, resp_keyword: 'Signal is not exist'}
      }
      const [alreadysignalunlocked, subscriber] = await Promise.all([
         this.signalunlockmapRepository.findOne({where: {signal_id, unlocked_by_user_id: user_id}}),
         this.userService.checkSubscribeUser(user_id, data.user_id)
      ])   
     
      if (!alreadysignalunlocked) {

         if (!subscriber && data.package_type == 'Premium') {
            throw  new BadRequestException('You don\'t have enough permission to unlock this signal, Please subscribe to unlock this signal')
         }

         // 
         if (!subscriber && data.package_type == 'Free') {
            const [userDetails, heroDetails] = await Promise.all([
               this.userService.getSingleuserById(user_id),
               this.userService.getSingleHeroById( data.user_id )
            ])  

            unlocked_price = heroDetails.signal_unlock_coin
            

            if (userDetails && userDetails.champion_coin < unlocked_price) {
               throw  new BadRequestException('You don\'t have enough Champion Coin')
            }
            const query = `select * from coin_conversion_rate where from_coin='champion' and to_coin='hero' order by id desc limit 1`
            const coin_conversion_rate = await this.DB.query(query, { type: QueryTypes.SELECT})
   
            let signalGiverReward = 0
            if (coin_conversion_rate.length) {
               signalGiverReward = +(unlocked_price * (coin_conversion_rate[0]['to_coin_amount'] / coin_conversion_rate[0]['from_coin_amount'] ))
           }
   
           await Promise.all([
            this.userService.addUserCoin(data.user_id, signalGiverReward, 'hero', `signalunlockbyuser signal_id => ${signal_id}, unlocked_by_user_id => ${user_id}`),
            this.userService.DecreaseUserCoin(user_id, unlocked_price, 'champion', `signalunlock signal_id => ${signal_id}`),
            this.signalunlockmapRepository.create({signal_id, unlocked_by_user_id: user_id})  
           ]) 
         }
         else {
            this.signalunlockmapRepository.create({signal_id, unlocked_by_user_id: user_id}) 
         }
     
      }
    
      return true
    }
}
