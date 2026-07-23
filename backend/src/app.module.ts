import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuthModule } from './auth/auth.module';
import { TransportOrdersModule } from './transport-orders/transport-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    VehiclesModule,
    OrganizationsModule,
    AuthModule,
    TransportOrdersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
