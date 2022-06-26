import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
@WebSocketGateway({namespace:'chat',cors:{
  origin: "http://localhost:5000",
  allowedHeaders: ["accessToken"],
  credentials: true}
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer()
    server:Socket;
  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto,@ConnectedSocket() client:Socket) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    console.log(message);
    this.server.emit('message', message);
    return message;
  }
  @UseGuards(AuthGuard())
  @SubscribeMessage('findAllMessages')
  findAll(@GetUser() user:User) {
    console.log(user);
    return this.messagesService.findAll();
  }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string, @ConnectedSocket() client:Socket){
    return this.messagesService.indetify(name, client.id)
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping:boolean,
  @ConnectedSocket() client: Socket){
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', {name, isTyping});
  }
  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
