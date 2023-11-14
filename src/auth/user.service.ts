import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(creatUserDto: CreateUserDto): Promise<User> {
    console.log('This action adds a new user');
    const user = new User();
    user.email = creatUserDto.email;
    user['password_hash'] = creatUserDto.passwordHash;
    user.username = creatUserDto.username;
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    console.log(`This action returns a #${id} user`);
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string) {
    console.log(`This action returns user by email`);
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async updateRefreshToken(id: number, token: string): Promise<UpdateResult> {
    console.log(`This action updates a #${id} user`);
    return this.userRepository.update(id, {
      refresh_token: token,
    });
  }
}
