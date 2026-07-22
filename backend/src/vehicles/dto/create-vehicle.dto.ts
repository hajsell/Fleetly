import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString({ message: 'Numer rejestracyjny musi być tekstem' })
  @IsNotEmpty({ message: 'Numer rejestracyjny jest wymagany' })
  @Length(2, 10, { message: 'Numer rejestracyjny musi mieć od 2 do 10 znaków' })
  licensePlate: string;

  @IsOptional()
  @IsIn(['avalible', 'in_use'], {
    message: 'Status musi być: avalible lub in_use',
  })
  status: 'available' | 'in_use';
}
