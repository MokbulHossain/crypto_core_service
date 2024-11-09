import { 
  Injectable,
  NestInterceptor,
  ExecutionContext, 
  CallHandler, 
  BadGatewayException, 
  RequestTimeoutException,
  BadRequestException,
  InternalServerErrorException,
  UnprocessableEntityException,
  NotFoundException,
  UnauthorizedException,
  ExceptionFilter, Catch, ArgumentsHost, Logger
} from '@nestjs/common';
import { Observable, throwError, TimeoutError, of } from 'rxjs';
import { tap, catchError,map,timeout } from 'rxjs/operators';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import {OK, UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR,NOT_FOUND, UNAUTHORIZED,BAD_REQUEST} from './responseHelper'
import { Request, Response } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userAgent = req.get('user-agent') || '';
    const { ip, originalUrl, method, params, query, body } = req;
    const {statusCode} = res
    const contentLength = res.get('content-length');

    return next.handle().pipe();

  }
}


@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next
      .handle()
      .pipe(
        catchError(err => { 
          const error = err
          if (err instanceof UnprocessableEntityException) {

            const payload = error.response.payload?error.response.payload:error.response

            try {

              Object.keys(payload).map(item => {
                payload[item] = payload[item].map(item2 => req.i18n.__(item2) || item2 )
              })
            } catch(e) { }
          
            return throwError(new UnprocessableEntityException(UNPROCESSABLE_ENTITY(error.response?error.response.message:null,payload,req)))
          
          }
          else if (err instanceof NotFoundException) {

            return throwError(new NotFoundException(NOT_FOUND(error.response?error.response.message:null,req)))

          }
          else if (err instanceof UnauthorizedException) {

            return throwError(new UnauthorizedException(UNAUTHORIZED(error.response?error.response.message:null,req)))

          }
          else if (err instanceof BadRequestException) {

            return throwError(new BadRequestException(BAD_REQUEST(error.response?error.response.message:null,error.response?error.response.message:null,req)))

          }
          else {

             console.log('error  ', error)
            return throwError(new InternalServerErrorException(INTERNAL_SERVER_ERROR(null,req)))

          }
        }),
      );
  }
}


@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next
      .handle()
      .pipe(
        map((data) => {

          let message = null
          if(data && data['res_message']) {

            message = data['res_message']
            delete data['res_message']
          }
          return OK(data, 200, message, req)

        })
      );
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(50000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  };
};

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).send(NOT_FOUND(null,request));
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).send(UNAUTHORIZED(null,request));
  }
}

export const interceptorProviders = [

            /*{
              provide: APP_INTERCEPTOR,
              useClass: LoggingInterceptor,
            },*/
            {
              provide: APP_INTERCEPTOR,
              useClass: TimeoutInterceptor,
            },
            {
              provide: APP_INTERCEPTOR,
              useClass: TransformInterceptor,
            },
            {
              provide: APP_INTERCEPTOR,
              useClass: ErrorsInterceptor,
            },
            {
              provide: APP_FILTER,
              useClass: HttpExceptionFilter,
            },
            /*{
              provide: APP_FILTER,
              useClass: UnauthorizedExceptionFilter,
            },*/
  
    ]
