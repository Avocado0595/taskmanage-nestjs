import { User } from "./user.entity";
import { Repository} from 'typeorm';
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CustomRepository } from "src/config/typeorm-ex.decorator";
// @CustomRepository(User)
// export class UserRepository extends Repository<User> {
//     // public async getAllPhoto() {
//     //     const query = this.createQueryBuilder('photo')
//     //         .where('photo.isPublished = :isPublished', { isPublished: true })
//     //     const photos = await query.getMany()
//     //     return photos
//     // }
// }
@CustomRepository(User)
export class UsersRepository extends Repository<User>{
    async createUser(authCredentialDto: AuthCredentialDto):Promise<User>{
        const {username, password} = authCredentialDto;
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const user = this.create({username, password: hash});
        try{
            return await this.save(user);
        }
        catch(err){
            if(err.code === 'ER_DUP_ENTRY')
                throw new ConflictException('User name already existed.');
            else
                throw new InternalServerErrorException();
        }
    }

}