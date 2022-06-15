import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
    private logger = new Logger();
    constructor(private authService: AuthService) {}
    @Post('/signup')
    async signup(@Body() authCredetialDto: AuthCredentialDto, @Res({passthrough: true}) res:Response): Promise<void>{
        this.logger.log(`Create ${authCredetialDto.username}`)
        const token =  await this.authService.signup(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 300000});
        return;
    }

    @Post('/signin')
    async signin(@Body() authCredetialDto: AuthCredentialDto,@Res({passthrough: true}) res:Response ): Promise<void>{
        this.logger.log(`${authCredetialDto.username} login`)
        const token = await this.authService.signin(authCredetialDto);
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 300000});
        return;
    }
}
