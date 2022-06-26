import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [{username: "user01", text:"hello"}];
  clientToUser = {};
  async create(createMessageDto: CreateMessageDto, clientId:string) {
    const newMessage = {username: await this.getClientName(clientId), text: createMessageDto.text};
    await this.messages.push(newMessage);
    return newMessage;
  }
  indetify(name: string, clientId: string){
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }
  async getClientName(clientId:string){
    return await this.clientToUser[clientId];
  }
  findAll() {
    return this.messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
