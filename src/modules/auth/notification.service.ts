import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios'
import { winstonLog } from '@config/winstonLog'

@Injectable()
export class NotificationService {
    constructor(
       
    ) { }

    async sendEmail({email, body, subject, user_id}) {
        
        const notificationBody = {
            email,
            body,
            subject
        }

        const url = process.env.EMAIL_NOTIFICATION_URL
        axios({
            url,
            method: 'POST',
            data: notificationBody,
            }).then(async response => {
        
                const responseData = response['data']
                winstonLog.log('info', `${url} api Response %o`, responseData, { transactionid_for_log: `user_id=${user_id}`});
                return responseData
                
            }).catch(async (e) => {

                const errorResponse = e['response'] ? (e['response']['data'] ? e['response']['data'] : e['response']) : e
                winstonLog.log('error', `${url} api Response %o`, errorResponse, { transactionid_for_log: `user_id=${user_id}`})

                return null
            })
    }


}