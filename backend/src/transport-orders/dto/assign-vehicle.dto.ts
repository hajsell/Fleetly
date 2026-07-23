import { IsInt, Min } from 'class-validator';

export class AssignVehicleDto {
  @IsInt()
  @Min(1)
  vehicleId: number;
}
