import { REDIS_CONNECTION } from '../constants';
import { createClient } from 'redis';
import 'dotenv/config';
import { decrypt } from '@helpers/cipher';

const IS_CRD_PLAIN = process.env.IS_CRD_PLAIN == 'true' ? true : false
const REDIS_HOST = IS_CRD_PLAIN ? process.env.REDIS_HOST : decrypt(process.env.REDIS_HOST)
const REDIS_PORT = IS_CRD_PLAIN ? process.env.REDIS_PORT : decrypt(process.env.REDIS_PORT)


const REDIS_URL = `redis://${REDIS_HOST}:${+(REDIS_PORT)}`;

const createRedisClient = async () => {
  let client = createClient({ url: REDIS_URL });

  console.log(`Redis url : `, REDIS_URL) 

  const connectClient = async () => {
    try {
      await client.connect();
      console.info('Redis Client connected successfully.');
    } catch (err) {
      console.error('Initial Redis Client connection failed', err);
      await reconnectClient();
    }
  };

  const isClientConnected = async () => {
    try {
      await client.ping();
      return true;
    } catch (err) {
      return false;
    }
  };

  const reconnectClient = async () => {
    console.info('Attempting to reconnect to Redis...');
    if (client.isOpen) {
      try {
        await client.quit();
      } catch (err) {
        console.error('Error while closing Redis client during reconnect', err);
      }
    }

    const attemptReconnect = async () => {
      console.info('Reconnecting to Redis...');
      try {
        client = createClient({ url: REDIS_URL });
        await client.connect();
        console.info('Reconnected to Redis successfully.');
      } catch (reconnectErr) {
        console.error('Reconnection to Redis failed', reconnectErr);
        setTimeout(attemptReconnect, 5000); // Retry after 5 seconds
      }
    };

    setTimeout(attemptReconnect, 5000); // Initial retry after 5 seconds
  };

  client.on('error', async (err) => {
    console.error('Redis Client Error', err);
    if (!(await isClientConnected())) {
      await reconnectClient();
    }
  });

  client.on('connect', () => console.info('Redis Client connected successfully'));
  client.on('idle', () => console.error('Redis queue is idle. Shutting down...'));
  client.on('end', () => console.error('Redis is shutting down.'));
  client.on('ready', () => console.info('Redis up! Now connecting the worker queue client...'));

  await connectClient();

  const performOperationWithReconnect = async (operation) => {
    try {
      return await operation();
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'NR_CLOSED') {
        console.error('Redis Client connection closed during operation, reconnecting...', err);
        await reconnectClient();
        return await operation();
      } else {
        throw err;
      }
    }
  };

  return {
    getClient: () => client,
    get: async (key) => await performOperationWithReconnect(() => client.get(key)),
    set: async (key, value) => await performOperationWithReconnect(() => client.set(key, value)),
    setEx: async (key, time, value) => await performOperationWithReconnect(() => client.setEx(key, time, value)),
    del: async (key) => await performOperationWithReconnect(() => client.del(key)),
    // Add other Redis operations as needed
  };
};

export const redisProviders = [
  {
    name: REDIS_CONNECTION,
    provide: REDIS_CONNECTION,
    useFactory: createRedisClient,
  },
];
