import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import {UNAUTHORIZED} from '../../helpers/responseHelper'
import 'dotenv/config'
import { decrypt } from '@helpers/cipher';

const IS_CRD_PLAIN = process.env.IS_CRD_PLAIN == 'true' ? true : false
const AUTH_MODULE = IS_CRD_PLAIN ? process.env.AUTH_MODULE : decrypt(process.env.AUTH_MODULE)

@Injectable()
export class AuthModuleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateHeaderRequest(request);
  }

  async validateHeaderRequest(request) { 

    const {headers = null} = request

    if (!headers || !headers['module'] || headers['module'] != AUTH_MODULE) {

        throw new UnauthorizedException(UNAUTHORIZED(null,request))

    }

    return true;
   }
}