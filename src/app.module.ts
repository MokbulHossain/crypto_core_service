import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module'
import {LoggerMiddleware, NoSniffMiddleware, XPoweredByMiddleware} from './middleware'

import {interceptorProviders} from './helpers/interceptor'

import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './config/redis/redis.module'
import { UserModule } from './modules/user/user.module';
import { SignalModule } from './modules/signal/signal.module';
import { RewardModule } from './modules/reward/reward.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { StoreModule } from './modules/store/store.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    SignalModule,
    RewardModule,
    CampaignsModule,
    StoreModule,
    UploadModule
  ],
  controllers: [

  ],
  providers: [

     ...interceptorProviders
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes('*');
  }
}
