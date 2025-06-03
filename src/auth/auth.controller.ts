import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('login')
    @UseGuards(LocalGuard)
    async login(@Body() loginDto: LoginDto){
        return await this.authService.authenticate(loginDto)
    }
}