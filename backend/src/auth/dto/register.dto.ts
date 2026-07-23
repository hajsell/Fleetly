import { OrganizationType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Podaj poprawny adres e-mail' })
  @IsNotEmpty({ message: 'Email jest wymagany' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nazwisko jest wymagane' })
  lastName: string;

  @IsString({ message: 'Nazwa organizacji musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa organizacji jest wymagana' })
  @Length(2, 100, {
    message: 'Nazwa organizacji musi mieć od 2 do 100 znaków',
  })
  organizationName: string;

  @IsEnum(OrganizationType, {
    message: 'Typ organizacji musi mieć wartość CUSTOMER albo PROVIDER',
  })
  organizationType: OrganizationType;
}
