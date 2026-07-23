import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [OrganizationService],
})
export class OrganizationsModule {}
