import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfigAsync } from 'src/config/jwt.config';
import { TypeOrmExModule } from 'src/config/typeorm-ex.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersRepository } from './user.repository';
@Module({imports:[
  PassportModule.register({defaultStrategy: 'jwt'}),
  JwtModule.registerAsync(jwtConfigAsync),
  TypeOrmExModule.forCustomRepository([UsersRepository])
],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy, PassportModule]
})
export class AuthModule {}
