import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { DatabaseModule } from '@config/database/database.module'
import { RedisModule } from '@config/redis/redis.module'

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [SignalService],
  controllers: [SignalController]
})
export class SignalModule {}
