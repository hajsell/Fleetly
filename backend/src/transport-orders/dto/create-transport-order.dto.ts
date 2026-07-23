import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateTransportOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 250)
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 250)
  dropoffAddress: string;

  @IsDateString()
  scheduledAt: string;

  @IsInt()
  @Min(1)
  @Max(100)
  passengerCount: number;
}
