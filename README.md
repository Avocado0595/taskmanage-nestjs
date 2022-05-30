Task App Structure
1. TaskModule
    - TasksController
    - TasksService
    - Status ValidationPipe
    - TasksEntity
    - TasksRepository
2. AuthModule
    - AuthController
    - AuthService
    - UserEntity
    - UserRepository
    - JwtStrategy
    - ...
3. EndPoints
    - TasksController: /tasks
        - GET /tasks        getAllTasks()
        - GET /tasks/:id    getTaskById() 
        - POST /tasks       createTask()
        - DELETE /tasks/:id deleteTask()
        - PATCH /tasks/:id/ updateTaskStatus()
    - AuthController: /auth
        - POST /auth/register register()
        - POST /auth/login   login()
        - POST /auth/logout  logout()
    - UserController: /users
        - GET /users/:id    getUserById()
        - POST /users       createUser()
        - PATCH /users/:id  updateUser()
        - DELETE /users/:id deleteUser()
5. Nestjs:
    - Modules
    - Controllers
    - Services and Providers
    - Controller-to-Service
    - Validation using Nestjs Pipes
6. Architechture
    - REST API
    - CRUD operation
    - Error handling
    - DTO (data transfer object)
    - System modularity
    - Backend best practices
    - Configure management
    - Logging
    - Security
7. demo flow: main call NestFactory(appmodule) 
=> appmodule(controller, service)
**decorator: 
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

decorator Module({truyen prop nay vao class phia duoi})

8. NestJs Module
- Singletons
- a folder per module
- define: @Module({})
- props:
    + providers:[]
    + controllers:[]
    + exports:[]
    + imports:[]
    + example
    * ForumModule
        - PostModule     
        - CommentModule  
            + UserProfileModule 
        - AuthModule
    =>
    ```ts
    @Module({
        providers:[ForumService],
        controllers:[ForumController],
        imports: [
            PostModule,
            CommentModule,
            AuthModule
        ],
        exports:[ForumService]
    })
    export class ForumModule{}
    ```
9. NestJs Controller
- handle request, return response
- bound to path
- dependency injection
- define: 
```ts
@Controller('/tasks')
export class TaskController{
    //handle request here
    @Get()
    getAllTasks(){
        return 'get all tasks';
    }
    @Post()
    createTask(){
        return 'create task';
    }
}
```
Flow 2: HTTP request => controller(endpoint, request data)
handle something => communicate service (interact with database)
=> reponse value (wrap in HTTP response) => return to client

10. NestJs Provider
- denpendency injection (@Injectable())
- Service:
    + defined as provider (not all providers are services)
    + singletons:  share with source of truth
    + be called from controller to interact with database
    + defined:
```ts
    @Module({
        cotrollers:[TaskController],
        providers:[TasksService, LoggerService]
    })
```
11. install uuid
12. controller: @Body(key?: string) <=>	req.body / req.body[key] => input key nếu ko muốn get cả object
13. DTO (data transfer object)
data flow: http request send object {title, description} => controller recive object {title, description}
=> call service function => service: add data to db, return result to controller => controller send response to client
**object {title, description}: DTO (not a model)
**using class
**example: 
```ts
class CreateShippingDto{
    orderId: string;
    shippingAddress: string;
    requiredSignature: boolean;
}
```
=> túm lại: dùng DTO này để việc truyền data giữa các layer được thống nhất hơn.

14. Pipes (same middlewares?)
- process arguments before calling controller
- perform data transformation or validation
- return original or modified data
- throw exception if data is invalid
- can be asynchronous
- ValidationPipe: validate dto data, ParseIntPipe: convert string to number
- CustomPipe:
- use pipes: 
    + handle-level: @UsePipes(ValidationPipe)
    + parameter-level: @Param('id') id: string, @UsePipes(ValidationPipe)
    + global pipes: app.useGlobalPipes(somePipe)
- chose level?
    + parameter: slimmer, cleaner. However: extra code, hard maintain
    + handler: more code, greate benefits:
        + do not require extra code at param level
        + easy maintain
        + indentify params
        + promote usage DTOs
        + 
*****series này dạy postgresql - lười cài nên dùng mysql ^^
15. TypeORM
16. Active Record and Data Mapper
- Active Record:
    + extends baseEntity
    + have method: find, findOne,...
    + for simple
- Data Mapper:
    + declare class entity
    + set up Repository: extends Repository<EntityName>
    + for maintain
** app.module : use TypeOrmModule.forRoot
** task.module : use TypeOrmModule.forFeature([UserEntity, TaskEntity])
