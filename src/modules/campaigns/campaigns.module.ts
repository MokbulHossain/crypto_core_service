import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignProviders } from './campaigns.provider'
@Module({
  providers: [CampaignsService, ...CampaignProviders],
  exports: [CampaignsService]
})
export class CampaignsModule {}
