import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import {Entity, PrimaryGeneratedColumn, Column,ManyToOne} from 'typeorm'
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

    @Column({nullable: true, default: () => 'CURRENT_TIMESTAMP'})
    startTime: Date;

    @Column({nullable: true, default: null})
    endTime: Date;

    @ManyToOne(_type=>User, user=>user.tasks, {eager: false})
    @Exclude({toPlainOnly: true})
    user: User;
}

