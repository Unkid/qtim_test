import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import {
  FORBIDDEN_ACTION,
  NOT_FOUND_EMAIL,
  NOT_FOUND_ID,
  UNAUTHORIZED,
  USER_EXISTS,
} from './auth.consts';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashData(data: string) {
    const salt = await genSalt(10);
    return hash(data, salt);
  }

  async getTokens(userId: number) {
    const accessToken = await this.jwtService.signAsync(
      {
        key: userId,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '3m',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        key: userId,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '3d',
      },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(id, hashedRefreshToken);
  }

  async singUp(signUpDto: SignUpDto) {
    const userExists = await this.userService.findByEmail(signUpDto.email);
    if (userExists) throw new BadRequestException(USER_EXISTS);

    const passwordHash = await this.hashData(signUpDto.password);
    const user = await this.userService.create({
      email: signUpDto.email,
      username: signUpDto.username,
      passwordHash: passwordHash,
    });
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(signInDto: LoginDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) throw new NotFoundException(NOT_FOUND_EMAIL);

    const correctPassword = await compare(
      signInDto.password,
      user['password_hash'],
    );
    if (!correctPassword) throw new UnauthorizedException(UNAUTHORIZED);

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(id: number, token: string) {
    const user = await this.userService.findById(id);
    if (!user || !user.refresh_token)
      throw new ForbiddenException(FORBIDDEN_ACTION);

    const correctToken = await compare(token, user['refresh_token']);
    if (!correctToken) throw new UnauthorizedException(UNAUTHORIZED);

    const tokens = await this.getTokens(id);
    await this.updateRefreshToken(id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: number) {
    this.userService.updateRefreshToken(id, null);
  }
}
