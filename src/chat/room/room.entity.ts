import { Task } from "src/tasks/task.entity";
import {CreateDateColumn, Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";

@Entity()
export class Room{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
}