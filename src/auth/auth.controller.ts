import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}
    
    @Post('login')
    @UseGuards(LocalGuard)
    async login(@Request() req){
        return req.user
    }
}