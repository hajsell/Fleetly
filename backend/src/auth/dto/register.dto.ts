import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Nazwa organizacji musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa organizacji jest wymagana' })
  organizationName: string;

  @IsEmail({}, { message: 'Podaj poprawny adres e-mail' })
  @IsNotEmpty({ message: 'Email jest wymagany' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Hasło musi mieć co najmniej 6 znaków' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nazwisko jest wymagane' })
  lastName: string;
}
