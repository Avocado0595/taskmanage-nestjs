import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import {typeOrmConfigAsync} from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
//import { ChatGateway } from './messages/chat.gateway';
// import { TypeOrmExModule } from './config/typeorm-ex.module';
// import { UsersRepository } from './auth/user.repository';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
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
