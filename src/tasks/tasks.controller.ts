import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getTasks(@Query() filterTaskDto:FilterTaskDto):Promise<Task[]> {
    if(Object.keys(filterTaskDto).length){
      return this.tasksService.filterTask(filterTaskDto);
    }
    else{
      return this.tasksService.getAllTasks();
    }
  }

  @Post('/')
  createTask(@Body() createTaskDto: CreateTaskDto ): Promise<Task>{
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id:string):Promise<Task>{
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id:string){
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id')
  updateTask(@Param('id') id:string, @Body() updateTaskDto: UpdateTaskDto ){
    return this.tasksService.updateTask(id,updateTaskDto);
  }
  // @Patch('/status/:id')
  // updateStatus(@Param('id') id:string, @Body('status') status: TaskStatus ){
  //   console.log(status);
  //   return this.tasksService.updateStatus(id,status);
  // }

}
