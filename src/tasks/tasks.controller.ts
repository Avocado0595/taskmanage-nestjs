import { Body, ConsoleLogger, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger();
  constructor(private tasksService: TasksService) {}
  @Get('/')
  getTasks(@Query() filterTaskDto:FilterTaskDto, @GetUser() user:User):Promise<Task[]> {
    if(Object.keys(filterTaskDto).length){
      return this.tasksService.filterTask(filterTaskDto, user);
    }
    else{
      return this.tasksService.getAllTasks(user);
    }
  }

  @Post('/')
  createTask(@Body() createTaskDto: CreateTaskDto,  @GetUser() user:User ): Promise<Task>{
    this.logger.log(`Create new task from ${user.username}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id:string, @GetUser() user:User ):Promise<Task>{
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id:string, @GetUser() user:User){
    this.logger.log(`Delete task id: ${id} from ${user.username}`);
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id')
  updateTask(@Param('id') id:string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() user:User ){
    this.logger.log(`Update task id: ${id} from ${user.username}`);
    return this.tasksService.updateTask(id, user,updateTaskDto);
  }
}
