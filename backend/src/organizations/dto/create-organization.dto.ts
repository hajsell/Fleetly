import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsString({ message: 'Nazwa organizacji musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa organizacji jest wymagana' })
  @Length(2, 50, { message: 'Nazwa organizacji musi mieć od 2 do 50 znaków' })
  name: string;
}
