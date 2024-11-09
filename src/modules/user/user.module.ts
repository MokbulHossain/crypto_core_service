import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '@config/database/database.module'
import { RedisModule } from '@config/redis/redis.module'
import { UserProviders } from './user.provides'

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  exports:[UserService]
})
export class UserModule {}
