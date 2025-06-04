import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected configService: ConfigService, protected usersService: UsersService) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:jwtSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);
        let isStatus = true
        return { isStatus, user };
        // return { userId: payload.sub, username: payload.username, role: payload.role };
        // const user = this.authService.authenticate({ username, password })
    }
}