import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { DatabaseModule } from '@config/database/database.module'
import { RedisModule } from '@config/redis/redis.module'
import { SignalProviders } from './signal.provider'

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [SignalService, ...SignalProviders],
  controllers: [SignalController]
})
export class SignalModule {}
