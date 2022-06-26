import { IsString } from "class-validator";

export class AvartarUpdateDto{
    @IsString()
    avatar:string;

    @IsString()
    userId:string;
}