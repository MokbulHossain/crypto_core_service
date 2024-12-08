import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { UserModule } from '../user/user.module'
import { CampaignsModule } from '../campaigns/campaigns.module'
@Module({
  imports: [UserModule, CampaignsModule],
  providers: [RewardService],
  controllers: [RewardController]
})
export class RewardModule {}
