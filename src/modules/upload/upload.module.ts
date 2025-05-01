import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

@Module({
  providers: [],
  controllers: [UploadController]
})
export class UploadModule {}
