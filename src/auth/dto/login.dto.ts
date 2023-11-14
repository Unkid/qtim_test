import { IsEmail, IsString, Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class LoginDto {
  @IsString()
  @IsEmail(null, { message: '' })
  email: string;

  @IsString()
  @Matches(passwordRegEx, { message: '' })
  password: string;
}
