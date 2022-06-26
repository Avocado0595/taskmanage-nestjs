import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import {typeOrmConfigAsync} from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import {join, resolve} from 'path'
import { MessagesModule } from './messages/messages.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(resolve(), '/public'),
  }),
    ConfigModule.forRoot({isGlobal:true, envFilePath:[`.env`]}),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule,
    AuthModule,
    MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
