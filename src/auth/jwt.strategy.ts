import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./user.repository";
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(UsersRepository)
    private userRepository: UsersRepository){
        super({
            secretOrKey: 'private',
            jwtFromRequest: ExtractJwt.fromExtractors([(request:Request) => {
                const data = request.cookies["accessToken"];
                if(!data){
                    return null;
                }
                return data;
            }]),
        })
    }

    async validate(payload:JwtPayload): Promise<Omit<User, 'password'>>{
        console.log(payload);
        const{username} = payload;
        const user: User = await this.userRepository.findOneBy({username});
        if(!user){
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        return result;
    }
}