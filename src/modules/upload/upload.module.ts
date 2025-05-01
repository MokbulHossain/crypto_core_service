import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MinioService } from './minio.service';
@Module({
  providers: [MinioService],
  controllers: [UploadController]
})
export class UploadModule {}
