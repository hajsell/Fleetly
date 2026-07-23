import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TransportOrdersController } from './transport-orders.controller';
import { TransportOrdersService } from './transport-orders.service';

@Module({
  imports: [AuthModule],
  controllers: [TransportOrdersController],
  providers: [TransportOrdersService],
})
export class TransportOrdersModule {}
