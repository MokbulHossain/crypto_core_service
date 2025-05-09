import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { url } from 'inspector';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MinioService } from './minio.service';

const imageFileFilter = (req: any, file: Express.Multer.File, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('Only image files are allowed!'), false);
    }
    callback(null, true);
  };

@Controller('upload')
export class UploadController {
    constructor(private readonly minioService: MinioService) {}


  @Post('image')
  @UseInterceptors(FileInterceptor('image', {
    // storage: diskStorage({
    //   destination: `./${process.env.MINIO_BUCKET}`,
    //   filename: (req, file, cb) => {
    //     const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    //     return cb(null, `${randomName}${extname(file.originalname)}`);
    //   }
    // }),
    fileFilter: imageFileFilter,
    limits: { fileSize: (1024 * 1024) * 2 } // 2MB
  }))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {

    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const filename = `${randomName}${extname(file.originalname)}`

    await this.minioService.uploadFile(file, filename);

    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `${process.env.MINIO_ACCESS_URL}/${process.env.MINIO_BUCKET}/${filename}`
    };
  }
}
