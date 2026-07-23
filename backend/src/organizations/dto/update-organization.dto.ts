import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString({ message: 'Nazwa organizacji musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa organizacji jest wymagana' })
  @Length(2, 100, {
    message: 'Nazwa organizacji musi mieć od 2 do 100 znaków',
  })
  name: string;
}
