import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./user.repository";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(UsersRepository)
    private userRepository: UsersRepository, configService: ConfigService){
        
        super({
            secretOrKey: configService.get('SECRET_ACCESSTOKEN'),
            jwtFromRequest: ExtractJwt.fromExtractors([(request:Request) => {
                const reqFromSocket = (request as any).handshake;
                if(reqFromSocket){
                    const data = reqFromSocket.headers.cookie.split(';')[0].split('=')[1];
                    if(!data){
                        return null;
                    }
                    return data;
                }
                else{
                    const data = request.cookies["accessToken"];
                    if(!data){
                        return null;
                    }
                    return data;
                }
            }]),
        })
    }

    async validate(payload:JwtPayload): Promise<Omit<User, 'password'>>{
        
        const{username} = payload;
        const user: User = await this.userRepository.findOneBy({username});
        if(!user){
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        return result;
    }
}

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   getRequest(context: ExecutionContext) {
//     const ws = context.switchToWs().getClient(); // possibly `getData()` instead.
//     return {
//       headers: {
//         authorization: valueFromWs(ws),
//       }
//     }
//   }
// }