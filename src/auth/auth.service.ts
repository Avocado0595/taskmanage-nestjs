import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService){}

    async signup(authCredentialDto: AuthCredentialDto):Promise<{accessToken: string}>{
        const user:User = await this.userRepository.createUser(authCredentialDto);
        const payload: JwtPayload = {username: user.username, id: user.id};
        const accessToken: string =  this.jwtService.sign(payload,{expiresIn: '1d'});
        return {accessToken};
    }

    async signin(authCredentialDto: AuthCredentialDto):Promise<{accessToken: string}>{
        const {username, password} = authCredentialDto;
        const user = await this.userRepository.findOneBy({username});
        if(user && (await bcrypt.compare(password, user.password))){
            const payload: JwtPayload = {username: user.username, id: user.id};
            const accessToken: string =  this.jwtService.sign(payload,{expiresIn: '1d'});
            return {accessToken};
        }
        else{
            throw new UnauthorizedException('Login fail.');
        }
    }
}
