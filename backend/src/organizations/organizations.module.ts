import { Module } from '@nestjs/common';
import { OrganizationService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationService],
})
export class OrganizationsModule {}
