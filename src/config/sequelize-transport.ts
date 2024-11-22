import Transport from 'winston-transport';
import { sequelizeWriteInstance } from './sequelize-instance'; // Import sequelize instance
import { LogModel as Log } from '../models'; // Import the Log model


export class SequelizeTransport extends Transport {
  private LogModel: typeof Log | null = null;

  constructor(opts) {
    super(opts);

    // Use an async method to initialize the LogModel
    this.initializeSequelizeModel();
  }

  async initializeSequelizeModel() {
    try {
      const sequelize = await sequelizeWriteInstance; // Wait for Sequelize to initialize
      this.LogModel = sequelize.model('LogModel') as typeof Log;
      console.info('initializing Sequelize model success');

    } catch (error) {
    //   console.error('Error initializing Sequelize model:', error);
      this.initializeSequelizeModel()
    }
  }

  async log(info, callback) {
    let { level, message, transactionid_for_log = null, label=null, ...meta } = info;
    transactionid_for_log = transactionid_for_log || ((message && typeof message == 'object') ? message['transactionid_for_log'] : null)
    if (!this.LogModel) {
      console.error('LogModel is not initialized');
      callback();
      return;
    }

    try {
      await this.LogModel.create({
        level,
        message,
        meta,
        label,
        timestamp: new Date(),
        transactionid : transactionid_for_log
      }, { logging: false})
    } catch (error) {
      console.error('Error logging to database', error);
    }

    callback();
  }
}
