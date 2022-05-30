import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class FilterTaskDto{
    @IsOptional()
    @IsString()
    search?:string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?:string;
}