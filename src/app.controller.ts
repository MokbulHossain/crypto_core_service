import { Controller,HttpStatus,HttpCode,  Get, Query, Post, Body,Res, Put, Param, Delete, Headers, Header } from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';

@Controller('hello')
export class AppController  {
  constructor(
    private readonly appService: AppService
  ) {
     // super()
  }

  @Get()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  getHello(): string {
    return this.appService.getHello();
  }
}
