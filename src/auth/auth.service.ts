import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-auth.dto';

type AuthInput = {username: string, password: string}
type SignInData = {userId: number, username: string, role: string}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService
    ){}

    async validateUser(authInput: AuthInput)
    {
        const user = await this.usersService.findUserByUsername(authInput.username)

        if(!user) return null
        const isMatch = await bcrypt.compare(authInput.password, user.password)
        if(isMatch){
            return {
                userId: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt
            }
        }
        throw new UnauthorizedException('Invalid credential')
    }

    async authenticate(loginDto: LoginDto)
    {
        const user = await this.validateUser(loginDto)
        if(!user) throw new UnauthorizedException('Invalid credential')
        return await this.signIn(user);
    }

    async signIn(user: SignInData)
    {
        const tokenPayload = {
            sub: user.userId,
            username: user.username,
            role: user.role
        }
        const token = await this.jwtService.signAsync(tokenPayload)
        const expiresIn = '1h'
        return { token, expiresIn, user }
    }
}
