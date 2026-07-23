import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  make: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  model: string;

  @IsString({ message: 'Numer rejestracyjny musi być tekstem' })
  @IsNotEmpty({ message: 'Numer rejestracyjny jest wymagany' })
  @Length(2, 12, { message: 'Numer rejestracyjny musi mieć od 2 do 12 znaków' })
  licensePlate: string;

  @IsInt()
  @Min(1)
  @Max(100)
  seatCapacity: number;
}
