import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Task } from "src/tasks/task.entity";

export default class TypeOrmConfig{
  static getOrmConfig(configService: ConfigService):TypeOrmModuleOptions{
    return {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: configService.get('DB_PASSWORD'),
    database: 'task_manager',
    entities: [Task],
    synchronize: true,}
  }
}

export const typeOrmConfigAsync:TypeOrmModuleAsyncOptions = {
  imports:[ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions>=>TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService]
}