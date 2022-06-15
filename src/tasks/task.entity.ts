import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import {Entity, PrimaryGeneratedColumn, Column, JoinTable,ManyToOne} from 'typeorm'
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

    @ManyToOne(_type=>User, user=>user.tasks, {eager: false})
    @Exclude({toPlainOnly: true})
    user: User;
}

