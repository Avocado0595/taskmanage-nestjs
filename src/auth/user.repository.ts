import { User } from "./user.entity";
import { Repository} from 'typeorm';
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CustomRepository } from "src/config/typeorm-ex.decorator";
@CustomRepository(User)
export class UsersRepository extends Repository<User>{
    async createUser(authCredentialDto: AuthCredentialDto):Promise<User>{
        const {username, password, email} = authCredentialDto;
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const user = this.create({username, email, password: hash});
        try{
            return await this.save(user);
        }
        catch(err){
            console.log(err);
            if(err.code === 'ER_DUP_ENTRY')
                throw new ConflictException('User name already existed.');
            else
                throw new InternalServerErrorException();
        }
    }

}