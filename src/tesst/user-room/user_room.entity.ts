import { Task } from "src/tasks/task.entity";
import {CreateDateColumn, Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";

@Entity()
export class UserRoom{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user: string;

    @Column()
    room: string;
}