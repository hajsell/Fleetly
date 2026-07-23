import { TransportOrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(TransportOrderStatus)
  status: TransportOrderStatus;
}
