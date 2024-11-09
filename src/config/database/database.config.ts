import { IDatabaseConfig, SequelizeLoggingFunction } from './database.interface';
import 'dotenv/config'
import { winstonLog } from '../winstonLog';
import { decrypt } from '@helpers/cipher';

const IS_CRD_PLAIN = process.env.IS_CRD_PLAIN == 'true' ? true : false
const DB_USER = IS_CRD_PLAIN ? process.env.DB_USER : decrypt(process.env.DB_USER)
const DB_PASS = IS_CRD_PLAIN ? process.env.DB_PASS : decrypt(process.env.DB_PASS )
const DB_HOST = IS_CRD_PLAIN ? process.env.DB_HOST : decrypt(process.env.DB_HOST )
const DB_PORT = IS_CRD_PLAIN ? process.env.DB_PORT : decrypt(process.env.DB_PORT)
const DB_DIALECT = IS_CRD_PLAIN ? process.env.DB_DIALECT : decrypt(process.env.DB_DIALECT )
const DB_NAME_DEVELOPMENT = IS_CRD_PLAIN ? process.env.DB_NAME_DEVELOPMENT : decrypt(process.env.DB_NAME_DEVELOPMENT )
const DB_NAME_TEST = IS_CRD_PLAIN ? process.env.DB_NAME_TEST : decrypt(process.env.DB_NAME_TEST )
const DB_NAME_PRODUCTION = IS_CRD_PLAIN ? process.env.DB_NAME_PRODUCTION : decrypt(process.env.DB_NAME_PRODUCTION )



const sequelizeLogging: SequelizeLoggingFunction = (sql: string, queryObject?: { bind: any }) => {
    const transactionid = queryObject && queryObject['replacements'] ? queryObject['replacements']['transactionid_for_log'] : null;  // Assuming transactionid is set in global context
    if (queryObject && queryObject.bind) {
      // Replace placeholders with actual values
      // console.log('queryObject => ', queryObject)
      const values = queryObject.bind;
      sql = sql.replace(/\$(\d+)/g, (_, index) => {
        const value = values[parseInt(index, 10) - 1];
        return typeof value === 'string' ? `'${value}'` : value;
      });
    }
    winstonLog.log('info', '%o',{ message: sql, transactionid_for_log:transactionid }, { label: 'Db-Log', transactionid_for_log:transactionid });
    
  }

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME_DEVELOPMENT,
        host: DB_HOST,
        port: +(DB_PORT),
        dialect: DB_DIALECT,
        dialectOptions: {
            useUTC: process.env.DB_USE_UTC, // for reading from database
          },
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: sequelizeLogging,
    },
    test: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME_TEST,
        host: DB_HOST,
        port: +(DB_PORT),
        dialect: DB_DIALECT,
        dialectOptions: {
            useUTC: process.env.DB_USE_UTC, // for reading from database
          },
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: sequelizeLogging,
    },
    production: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME_PRODUCTION,
        host: DB_HOST,
        port: +(DB_PORT),
        dialect: DB_DIALECT,
        dialectOptions: {
            useUTC: process.env.DB_USE_UTC, // for reading from database
          },
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: sequelizeLogging,
    },
};