import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios'

@Injectable()
export class NotificationService {
    constructor(
       
    ) { }

    async sendEmail({email, body, subject}) {
        
       const data = {email, body, subject}
       const url = process.env.EMAIL_NOTIFICATION_URL

        axios({
            url,
            method: 'POST',
            data
        }).then(resp => console.log(resp.data))
        .catch(e => console.log(e))
    }


}