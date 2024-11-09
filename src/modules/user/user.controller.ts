import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service'

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}
   
    @Get('passwordConfig')
    async passwordConfig() {
        
        return await this.userService.passwordConfig()
        
    }

    @Get('countries')
    async counties() {
        
        return await this.userService.counties()
        
    }
}
