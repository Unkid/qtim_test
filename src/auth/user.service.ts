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
    const user = new User();
    user.email = creatUserDto.email;
    user['password_hash'] = creatUserDto.passwordHash;
    user.username = creatUserDto.username;
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async updateRefreshToken(id: number, token: string): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      refresh_token: token,
    });
  }
}
