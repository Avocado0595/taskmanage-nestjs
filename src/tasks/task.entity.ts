import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title:string;

    @Column()
    status :TaskStatus;

    @Column()
    description:string;
}

