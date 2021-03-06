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
12. controller: @Body(key?: string) <=>	req.body / req.body[key] => input key n???u ko mu???n get c??? object
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
=> t??m l???i: d??ng DTO n??y ????? vi???c truy???n data gi???a c??c layer ???????c th???ng nh???t h??n.

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
*****series n??y d???y postgresql - l?????i c??i n??n d??ng mysql ^^
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
17. authentication:  verify who are you
18. authorization: give somebody permission depend on their indentity
19. JWT = header (meta data: type, hashing algorithm) + payload (data: user, ...) + signature (encoded header, encoded payload, secret key)
20. S??? d???ng JWT trong nestjs
- install: @nestjs/jwt, passport, passport-jwt
- import auth.module
```ts
imports:[
  PassportModule.register({defaultStrategy: 'jwt'}),
  JwtModule.register({
    secret: '?????t 1 private key ??? ????y',
    signOptions:{
      expiresIn: 3600, //th???i gian h???t h???n c???a token
    }
  })],
```
- get token: const accessToken: string =  this.jwtService.sign(payload);
- verify token:
    + install: @types/passport-jwt
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(UsersRepository)
    private userRepository: UsersRepository){
        super({
            secretOrKey: 'private', //add l???i secret key ??? ????y
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//extract token t??? (bearer) header
        })
    }

    async validate(payload:JwtPayload): Promise<string>{ //method overload t??? PassportStrategy,
    // s??? verify token, decode => payload
        const{username} = payload;
        const user: User = await this.userRepository.findOne({username});
        if(!user){
            throw new UnauthorizedException();
        }

        return "user"; //c??i n??y s??? tr??? v??? request => request n??y tr??? v??? object t??n l?? user ????
        //2 d??ng n??y ????? lo???i pasword ra kh???i request tr??? v???
        const { password, ...result } = user;
        return result;
    }
}
```
    +  @UseGuards(AuthGuard()) => ?????t middleware n??y ????? verify token tr?????c r???i n??o c???n authorization
- decorator ????? l???y data t??? request sau khi verify token
```ts
export const GetUser = createParamDecorator((_data, ctx: ExecutionContext):User=>{
    const req = ctx.switchToHttp().getRequest(); //get data t??? request
    return req.user; //ch??? l???y user t??? token
})
```
21. Relationship
```
@ManyToOne(_type=>User, user=>user.tasks, {eager: false})
    user: User;
```
{eager: true} => eager loading: load data from other table

22. @Exclude
```ts
@ManyToOne(_type=>User, user=>user.tasks, {eager: false})
    @Exclude({toPlainOnly: true})
    user: User;
```
??o???n n??y lo???i b??? c???t user trong task khi tr??? v??? plain object: json
c???n config th??m: nestInterceptor - instanceToPlain (file: transform.inerceptor)

23. Socket.io - app chat
![ERD DB CHAT SIMPLE](public/erd-app-chat-simple.png)
25. Custom AuthGuard
```ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();//get request t??? http
    console.log(request.handshake);
    return true;
  }
}
//use: @UseGuards(AuthGuard)
```
25. D??ng configService trong Module
```ts
import { ConfigModule, ConfigService } from "@nestjs/config"

export class JwtConfig{ //t???o class base
    static getJwtConfig(configService: ConfigService){ //ph????ng th???c static, init ConfigService
      return { //return gi?? tr??? c???n s??? d???ng
        secret: configService.get('SECRET_ACCESSTOKEN'),
          signOptions:{
            expiresIn: 36000,
          }
      }
  }
}
  
  export const jwtConfigAsync = { //d??ng useFactory ????? inject ConfigService
    imports:[ConfigModule],
    useFactory: async (configService: ConfigService): Promise<JwtConfig>=>JwtConfig.getJwtConfig(configService),
    inject: [ConfigService]
  }

  //s??? d???ng
  JwtModule.registerAsync(jwtConfigAsync),
```
26. L???i EntityRepository deprecated: t???o c??c file sau ????? d??ng CustomDecorator
- typeorm-ex.decorator.ts
- typeorm-ex.module.ts
27. Upload file
- install: multer
- middleware:
```ts
 @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: join(resolve(),'/public/avatars'),
            filename:  (_req, _res, cb)=> cb(null, v4() + '.png')
        })
    }))
```
