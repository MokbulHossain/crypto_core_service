import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { UserModule } from '../user/user.module'
import { CampaignsModule } from '../campaigns/campaigns.module'
import { DatabaseModule } from '@config/database/database.module'
import { RewardProviders } from './reward.prodivers'

@Module({
  imports: [UserModule, CampaignsModule, DatabaseModule],
  providers: [RewardService, ...RewardProviders],
  controllers: [RewardController]
})
export class RewardModule {}
