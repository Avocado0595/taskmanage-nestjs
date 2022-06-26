import { BadRequestException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CustomRepository } from 'src/config/typeorm-ex.decorator';
import {Repository} from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task>{
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        if(createTaskDto.endTime)
        {
            const endTime = new Date(createTaskDto.endTime.toString());
            if(endTime < new Date() || endTime == new Date())
                throw new BadRequestException('Endtime must be in after today.')
        }
        
        const task = this.create({...createTaskDto, user, status: TaskStatus.OPEN});
        return await this.save(task);
    }

    async getTasks(filterTaskDto: FilterTaskDto, user: User):Promise<Task[]>{
        const query = this.createQueryBuilder('task');
        const {status, search} = filterTaskDto;
        query.where({user});
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) or  LOWER(task.description) LIKE LOWER(:search))', {search : `%${search}%`})
        }
        const task = await query.getMany();
        return task;
    }
    async updateMissedTasks(user:User){
        const query = this.createQueryBuilder();
        await query.update(Task)
        .where({user})
        .andWhere("task.status = :status1 OR task.status = :status2",{status1: TaskStatus.OPEN, status2: TaskStatus.IN_PROGRESS})
        .andWhere("task.endTime < :today",{today: new Date()})
        .set({status: TaskStatus.MISSED})
        .execute()
    }
}