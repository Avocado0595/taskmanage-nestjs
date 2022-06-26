import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";

@WebSocketGateway({cors: true, namespace: 'chat'})
export class ChatGateway{
    @WebSocketServer()
    server:Socket;

    //@UseGuards(AuthGuard())
    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() mess: string,): void{
        this.server.emit('message', {mess});
    }
   
}