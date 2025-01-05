import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { UserModule } from '../user/user.module'
import { CampaignsModule } from '../campaigns/campaigns.module'
@Module({
  imports: [UserModule, CampaignsModule],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}