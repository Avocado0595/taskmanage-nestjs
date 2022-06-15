import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus} from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepo: TaskRepository) {}

  getAllTasks(user:User):Promise<Task[]> {
    console.log('start');
    return this.tasksRepo.find({where: {user: user}});
  }

  createTask(createTaskDto: CreateTaskDto, user: User):Promise<Task>{
    return this.tasksRepo.createTask(createTaskDto, user);
  }

  async getTaskById(id:string, user: User):Promise<Task>{
    const found = await this.tasksRepo.findOneBy({id, user});
    if(!found){
      throw new NotFoundException(`Task with id: ${id} not found.`);
    }
      return found;
  }

  async deleteTask(id:string, user: User):Promise<void>{
    const task = await this.tasksRepo.delete({id,user});
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }

  async updateTask(id:string,user:User, updateTaskDto: UpdateTaskDto):Promise<void>{
    const task = await this.tasksRepo.update({id, user}, updateTaskDto);
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }

  filterTask(filterTaskDto:FilterTaskDto, user: User):Promise<Task[]>{
    return this.tasksRepo.getTasks(filterTaskDto, user);
  }

  async updateStatus(id:string, status: TaskStatus):Promise<void>{
    const task = await this.tasksRepo.update(id, {status});
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }
}
