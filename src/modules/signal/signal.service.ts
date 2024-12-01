import { Injectable , Inject} from '@nestjs/common';
import { Op } from 'sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../../config/constants'

@Injectable()
export class SignalService {
    constructor(

        @Inject(DATABASE_CONNECTION) private DB: Sequelize

    ) { }

    async signalConfig() {

        const payload = {
            "coin_types":[
               {
                  "id":1,
                  "name":"BTCUSDT"
               },
               {
                  "id":2,
                  "name":"ETHUSDT"
               }
            ],
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
    async create(user_id, reqdata) {

    }
}
