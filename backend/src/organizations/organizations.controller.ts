import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organizations.service';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('me')
  findMine(@CurrentUser() authUser: AuthUser) {
    return this.organizationService.findMine(authUser);
  }

  @Patch('me')
  updateMine(
    @CurrentUser() authUser: AuthUser,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateMine(authUser, dto);
  }
}
