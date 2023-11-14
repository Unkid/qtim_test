import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class SignUpDto {
  @IsString()
  @IsEmail(null, { message: '' })
  email: string;

  @IsString()
  @MinLength(5, { message: '' })
  username: string;

  @IsString()
  @Matches(passwordRegEx, { message: '' })
  password: string;
}
