import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
    {message: 'Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character.'})
    password: string;
}