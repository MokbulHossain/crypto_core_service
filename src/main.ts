import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express'
import {expressBind} from 'i18n-2'
import {localize} from './middleware'
import { ValidateInputPipe } from './middleware/validate';
import {AuthModuleGuard} from './middleware/guards'
import {nestwinstonLog, HttpPortLog} from './config/winstonLog'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fs from 'fs'

async function bootstrap() {

    //read ssl config....
    const httpsOptions = {
      key: fs.readFileSync('./ssl/keyfile-encrypted.key'),
      cert: fs.readFileSync('./ssl/97580e4c070d1482.crt'),
      ca: [ fs.readFileSync('./ssl/gd1.crt')],
      passphrase: "Mlajan@123##" 
    }

  const NestFactoryOptions = {logger:  nestwinstonLog}

  if(process.env.SSL == 'true') { 
    //enable ssl..
    NestFactoryOptions['httpsOptions'] = httpsOptions
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule,NestFactoryOptions)

 // global prefix
  app.setGlobalPrefix('core')
  
   expressBind(app, {locales: [ 'en', 'bn' ] })
 
   app.use(localize)

   //handle browser cros..
   app.enableCors()

  // handle all user input validation globally

  app.useGlobalPipes(new ValidateInputPipe());

  //use globally to check auth module from request header
  // app.useGlobalGuards(new AuthModuleGuard())

  await app.listen(process.env.PORT || 3000, () => HttpPortLog(process.env.PORT || 3000));

}

bootstrap();
