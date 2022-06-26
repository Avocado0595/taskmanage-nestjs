import { Body, Controller, Logger, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {join, resolve} from 'path';
import { v4 } from 'uuid';
import { GetUser } from './get-user.decorator';
import { userInfo } from 'os';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import Resize from 'src/utils/resize-image';
@Controller('auth')
export class AuthController {
    private logger = new Logger();
    constructor(private authService: AuthService) {}
    @Post('signup')
    async signup(@Body() authCredetialDto: AuthCredentialDto, @Res({passthrough: true}) res:Response): Promise<void>{
        
        this.logger.log(`Create ${authCredetialDto.username}`)
        const token =  await this.authService.signup(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 300000});
        return;
    }

    @Post('signin')
    async signin(@Body() authCredetialDto: AuthCredentialDto,@Res({passthrough: true}) res:Response ): Promise<void>{
        this.logger.log(`${authCredetialDto.username} login`)
        const token = await this.authService.signin(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 1000*60*60*24*7});
        return;
    }
    @UseGuards(AuthGuard())
    @Patch('avatar/update')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(@UploadedFile() file: Express.Multer.File, @GetUser() user: User): Promise<void>{
        const imagePath = join(resolve(), '/public/avatars');
        const fileUpload = new Resize(imagePath);
        const avatarPath = await fileUpload.save(file.buffer);
        await this.authService.updateAvatar({userId: user.id, avatar: avatarPath});
        return;
    }
}

/*
, {
        storage: diskStorage({
            destination: join(resolve(),'/public/avatars'),
            filename:  (_req, _res, cb)=> cb(null, v4() + '.png')
        })
    }
 */