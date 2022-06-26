import { Body, Controller, Logger, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 } from 'uuid';
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

    @Patch('avatar/update')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
          destination: 'D:\\DOCUMENT\\PROJECT101\\TodoFullStack\\nestjs\\task-management\\public\\avatars',
          filename: function (req, file, cb) {
            cb(null, Date.now() + '.jpg') 
          }
          
        })
      }))
    async updateAvatar(@UploadedFile() file: Express.Multer.File): Promise<void>{
        console.log(file);
        return;
    }
}
