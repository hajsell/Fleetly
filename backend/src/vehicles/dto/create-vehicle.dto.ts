export class CreateVehicleDto {
  organizationId!: string;
  make!: string;
  model!: string;
  licensePlate!: string;
  status?: 'available' | 'in_use';
}
