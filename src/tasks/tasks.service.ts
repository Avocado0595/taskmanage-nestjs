import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = ['a'];
  getAllTasks() {
    return this.tasks;
  }
}
