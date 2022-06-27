import { Body, Controller, Logger, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {join, resolve} from 'path';
import { GetUser } from './get-user.decorator';

import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import Resize from 'src/utils/resize-image';
@Controller('api/auth')
export class AuthController {
    private logger = new Logger();
    constructor(private authService: AuthService) {}
    @Post('signup')
    async signup(@Body() authCredetialDto: AuthCredentialDto, @Res({passthrough: true}) res:Response): Promise<void>{
        const token =  await this.authService.signup(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 300000});
        this.logger.log(`Create ${authCredetialDto.username}`)
        return;
    }

    @Post('signin')
    async signin(@Body() authCredetialDto: Omit<AuthCredentialDto,"email">,@Res({passthrough: true}) res:Response ): Promise<void>{
        const token = await this.authService.signin(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 1000*60*60*24*7});
        this.logger.log(`${authCredetialDto.username} login`)
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