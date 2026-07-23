import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipRole, Organization } from '@prisma/client';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(authUser: AuthUser): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: authUser.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organizacja nie istnieje.');
    }

    return organization;
  }

  async updateMine(
    authUser: AuthUser,
    dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    if (authUser.role !== MembershipRole.OWNER) {
      throw new ForbiddenException(
        'Tylko właściciel może edytować organizację.',
      );
    }

    return this.prisma.organization.update({
      where: { id: authUser.organizationId },
      data: { name: dto.name.trim() },
    });
  }
}
