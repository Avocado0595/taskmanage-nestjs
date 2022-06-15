import { User } from 'src/auth/user.entity';
import {Repository,EntityRepository} from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const {title, description} = createTaskDto;
        const task = this.create({title, description, user, status: TaskStatus.OPEN});
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
}