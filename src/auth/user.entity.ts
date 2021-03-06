import { Exclude } from "class-transformer";
import { Task } from "src/tasks/task.entity";
import { Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({default:''})
    avatar: string

    @OneToMany(_type=>Task, task => task.user, {eager: true})
    @Exclude({toPlainOnly: true})
    tasks: Task[];
}