import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, TEST, PRODUCTION, DATABASE_CONNECTION } from '../constants';
import { databaseConfig } from './database.config';
 
import * as models from '../../models'

//console.log(Object.values(models))
export const databaseProviders = [ 
    //dpay db connection...
    {
    name : DATABASE_CONNECTION, 
    provide: DATABASE_CONNECTION, 
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.development;
           break;
        case TEST:
           config = databaseConfig.test;
           break;
        case PRODUCTION:
           config = databaseConfig.production;
           break;
        default:
           config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels(Object.values(models));
       //Check connection establish or not......
            sequelize.authenticate()
            .then(function () {
                const loggingdata = {
                    HOST : config.host,
                    PORT : config.port
                }
                console.log(loggingdata)
                console.log(`${config.database} DB CONNECTED!`);
            })
            .catch(function (err) {
                const loggingdata = {
                    HOST : config.host,
                    PORT : config.port
                }
                console.log(loggingdata)
                console.log(`${config.database} DB Connection Error !!`);
                console.log(err)
            })

        return sequelize
    }
}];

export const sequelizeWriteInstance = (async () => {
    return await databaseProviders[0].useFactory();
  })();