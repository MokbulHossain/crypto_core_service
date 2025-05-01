// src/minio/minio.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import  * as Minio from 'minio';  // This is correct

@Injectable()
export class MinioService  implements OnModuleInit{
  private minioClient: Minio.Client;


  constructor() {}

  async onModuleInit() {
    try {
        this.minioClient = new Minio.Client({
          endPoint: process.env.MINIO_ENDPOINT ,
          port: parseInt(process.env.MINIO_PORT),
          useSSL: process.env.MINIO_USE_SSL === 'true',
          accessKey: process.env.MINIO_ACCESS_KEY,
          secretKey: process.env.MINIO_SECRET_KEY,
        })
        this.testConnection();
      } catch (error) {
        console.error('MinIO initialization failed:', error);
        throw new Error('Failed to initialize MinIO client');
      }

    
  }

  async testConnection() {
    try {
      await this.minioClient.listBuckets();
      console.log('✅ MinIO connection established');
    } catch (error) {
      console.error('❌ MinIO connection failed:', error.message);
    }
  }

  async uploadFile(file: Express.Multer.File, fileName) {
    // const fileName = `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );
    return fileName;
  }
}