import { IsEmail, IsString, Matches } from 'class-validator';
import {
  EMAIL_NOT_STRING,
  NOT_VALID_EMAIL,
  NOT_VALID_PASSWORD,
  PASSWORD_NOT_STRING,
} from './dtos.consts';

const passwordRegEx =
  /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,20}/;

export class LoginDto {
  @IsString({
    message: EMAIL_NOT_STRING,
  })
  @IsEmail({}, { message: NOT_VALID_EMAIL })
  email: string;

  @IsString({
    message: PASSWORD_NOT_STRING,
  })
  @Matches(passwordRegEx, { message: NOT_VALID_PASSWORD })
  password: string;
}
