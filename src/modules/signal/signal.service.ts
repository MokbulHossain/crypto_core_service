import { Injectable , Inject} from '@nestjs/common';
import { Op } from 'sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../../config/constants'
import {SignalModel, SignalTargetModel, CoinTypeModel} from '../../models'
import {REDIS_CONNECTION, SIGNAL_REPOSITORY, SIGNAL_TARGET_REPOSITORY, COINTYPE_REPOSITORY} from '../../config/constants'
import { SignalCreateDto } from '../../dto'
import axios from 'axios'
import { winstonLog } from '@config/winstonLog'

@Injectable()
export class SignalService {
    constructor(

        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        @Inject(REDIS_CONNECTION) private redisClient: any,
        @Inject(SIGNAL_REPOSITORY) private readonly signalRepository: typeof SignalModel,
        @Inject(SIGNAL_TARGET_REPOSITORY) private readonly signalTargetRepository: typeof SignalTargetModel,
        @Inject(COINTYPE_REPOSITORY) private readonly cointypeRepository: typeof CoinTypeModel,

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
            this.redisClient.setEx(`coin_price:${coin_name}`, 10, (respData['price']))
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
      const sortData = reqdata.signal_targets.sort((a, b) => a - b)
      const targetData = sortData.map(item => ({signal_id: id, target: item}))

      await Promise.all([
         this.signalRepository.create({...reqdata, id, user_id}),
         this.signalTargetRepository.bulkCreate(targetData)
      ])

      return true
    }
}
