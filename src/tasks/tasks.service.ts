import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus} from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepo: TaskRepository) {}

  getAllTasks():Promise<Task[]> {
    return this.tasksRepo.find();
  }

  createTask(createTaskDto: CreateTaskDto):Promise<Task>{
    return this.tasksRepo.createTask(createTaskDto);
  }

  async getTaskById(id:string):Promise<Task>{
    const found = await this.tasksRepo.findOne(id);
    if(!found){
      throw new NotFoundException(`Task with id: ${id} not found.`);
    }
      return found;
  }

  async deleteTask(id:string):Promise<void>{
    const task = await this.tasksRepo.delete(id);
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }

  async updateTask(id:string, updateTaskDto: UpdateTaskDto):Promise<void>{
    const task = await this.tasksRepo.update(id, updateTaskDto);
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }

  filterTask(filterTaskDto:FilterTaskDto):Promise<Task[]>{
    return this.tasksRepo.getTasks(filterTaskDto);
  }

  async updateStatus(id:string, status: TaskStatus):Promise<void>{
    const task = await this.tasksRepo.update(id, {status});
    if(task.affected===0)
      throw new NotFoundException(`Task with id: ${id} not found.`);
  }
}
