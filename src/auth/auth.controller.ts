import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { RefreshTokenGuard } from '../guards/refresh.guard';
import { AccessTokenGuard } from '../guards/access.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  signup(@Body() signupDto: SignUpDto) {
    return this.authService.singUp(signupDto);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@Req() req: Request) {
    const userId = req.user['key'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    const userId = req.user['key'];
    return this.authService.logout(userId);
  }
}
