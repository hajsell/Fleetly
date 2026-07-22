import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VehicleStatus } from '@prisma/client';

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
  @IsEnum(VehicleStatus, {
    message: 'Status musi być jedną z wartości: AVAILABLE, IN_USE, MAINTENANCE',
  })
  status: VehicleStatus;
}
