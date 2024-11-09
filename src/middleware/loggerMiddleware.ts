import { Request, Response, NextFunction } from "express";
import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import {requestBodyLog, HttpUrlLog} from '../config/winstonLog'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body, headers } = request;
    const userAgent = request.get("user-agent") || "";

    let transactionId = '';
    
    // Extract transaction ID from Bearer token
    const authHeader = headers['authorization'];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        // const decoded = jwt.decode(token) as { transactionId? };
        // transactionId = decoded?.transactionId || '';
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    transactionId = transactionId ? `user_id=${transactionId}` : 'N/A'
    request['transactionid_for_log'] = transactionId

    requestBodyLog({...body, transactionid_for_log: transactionId})

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");

      HttpUrlLog(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`)

    });

    next();
  }
}