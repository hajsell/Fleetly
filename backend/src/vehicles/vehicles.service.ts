import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MembershipRole,
  OrganizationType,
  Prisma,
  Vehicle,
} from '@prisma/client';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleStatusDto } from './dto/update-vehicle-status.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authUser: AuthUser, dto: CreateVehicleDto): Promise<Vehicle> {
    this.assertCanManageVehicles(authUser);

    try {
      return await this.prisma.vehicle.create({
        data: {
          organizationId: authUser.organizationId,
          make: dto.make.trim(),
          model: dto.model.trim(),
          licensePlate: this.normalizeLicensePlate(dto.licensePlate),
          seatCapacity: dto.seatCapacity,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Pojazd o tym numerze rejestracyjnym już istnieje w organizacji.',
        );
      }
      throw error;
    }
  }

  findAll(authUser: AuthUser): Promise<Vehicle[]> {
    if (authUser.organizationType !== OrganizationType.PROVIDER) {
      throw new ForbiddenException(
        'Pojazdy są dostępne tylko dla przewoźników.',
      );
    }

    return this.prisma.vehicle.findMany({
      where: { organizationId: authUser.organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    authUser: AuthUser,
    vehicleId: number,
    dto: UpdateVehicleStatusDto,
  ): Promise<Vehicle> {
    this.assertCanManageVehicles(authUser);

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, organizationId: authUser.organizationId },
    });

    if (!vehicle) {
      throw new NotFoundException('Pojazd nie istnieje.');
    }

    return this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: dto.status },
    });
  }

  private assertCanManageVehicles(authUser: AuthUser): void {
    if (authUser.organizationType !== OrganizationType.PROVIDER) {
      throw new ForbiddenException(
        'Tylko przewoźnik może zarządzać pojazdami.',
      );
    }

    if (authUser.role !== MembershipRole.OWNER) {
      throw new ForbiddenException(
        'Tylko właściciel może zarządzać pojazdami.',
      );
    }
  }

  private normalizeLicensePlate(licensePlate: string): string {
    return licensePlate.trim().replace(/\s+/g, '').toUpperCase();
  }
}
