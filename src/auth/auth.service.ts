import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { AvartarUpdateDto } from './dto/avatar-update.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService){}

    async signup(authCredentialDto: AuthCredentialDto):Promise<{accessToken: string,  user: UserResponseDto}>{
        
        const {password,...user} = await this.userRepository.createUser(authCredentialDto);
        const payload: JwtPayload = {username: user.username, id: user.id};
        const accessToken: string =  this.jwtService.sign(payload,{expiresIn: '1d'});
        return {accessToken, user};
    }

    async signin(authCredentialDto: Omit<AuthCredentialDto,"email">):Promise<{accessToken: string, user: UserResponseDto}>{
        const {username, password} = authCredentialDto;
        const {password:userPassword, ...user} = await this.userRepository.findOneBy({username});
        if(user && (await bcrypt.compare(password, userPassword))){
            const payload: JwtPayload = {username: user.username, id: user.id};
            const accessToken: string =  this.jwtService.sign(payload,{expiresIn: '1d'});
            return {accessToken, user};
        }
        else{
            throw new UnauthorizedException('Login fail.');
        }
    }

    async updateAvatar(avatarupdateDto: AvartarUpdateDto){
        const {userId:id, avatar} = avatarupdateDto;
        return await this.userRepository.update({id},{avatar});
    }
}
