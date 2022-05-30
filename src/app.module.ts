import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import {typeOrmConfigAsync} from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
