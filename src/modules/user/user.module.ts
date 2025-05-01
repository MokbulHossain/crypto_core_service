import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '@config/database/database.module'
import { RedisModule } from '@config/redis/redis.module'
import { UserProviders } from './user.provides'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [DatabaseModule, RedisModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  exports:[UserService],
})
export class UserModule {}
