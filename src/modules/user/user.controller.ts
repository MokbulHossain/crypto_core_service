import { Controller, Get, UseGuards, Request, Post, Query } from '@nestjs/common';
import { UserService } from './user.service'
import { JwtAuthGuard } from '../../middleware/guards'

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

    @UseGuards(JwtAuthGuard)
    @Get('herolist')
    async list(@Request() req, @Query() reqdata) {
        
        return await this.userService.herolist(reqdata['page'] || 1, reqdata['limit'] || 10, reqdata['search'] || null)
        
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('follow')
    // async follow(@Request() req) {
        
    //     return await this.userService.follow(req.user['user_id'], )
        
    // }
}
