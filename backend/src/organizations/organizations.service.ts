import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Organization } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

const SUBSCRIPTION_STATUSES = ['active', 'trialing', 'inactive'] as const;
type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto): Promise<Organization> {
    try {
      return await this.prisma.organization.create({ data: dto });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(`Organizacja z tą nazwą już istnieje`);
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organizacja o id ${id} nie istnieje`);
    }

    return organization;
  }

  async updateSubscriptionStatus(
    id: string,
    status: string,
  ): Promise<Organization> {
    if (!this.isSubscriptionStatus(status)) {
      throw new BadRequestException(
        `Nieprawidłowy status subskrypcji. Dozwolone wartości: ${SUBSCRIPTION_STATUSES.join(',')}`,
      );
    }

    try {
      return await this.prisma.organization.update({
        where: { id },
        data: { subscriptionStatus: status },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Organizacja o id ${id} nie istnieje`);
      }

      throw error;
    }
  }

  private isSubscriptionStatus(status: string): status is SubscriptionStatus {
    return SUBSCRIPTION_STATUSES.includes(status as SubscriptionStatus);
  }
}
