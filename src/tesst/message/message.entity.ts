
import {CreateDateColumn, Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";

@Entity()
export class Message{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user: string;

    @Column()
    room: string;

    @Column()
    content: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
}