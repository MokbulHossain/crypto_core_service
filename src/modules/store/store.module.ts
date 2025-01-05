import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { UserModule } from '../user/user.module'
import { CampaignsModule } from '../campaigns/campaigns.module'
import { DatabaseModule } from '@config/database/database.module'

@Module({
  imports: [UserModule, CampaignsModule, DatabaseModule],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}