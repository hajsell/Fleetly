import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Vehicle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleStatus } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async createVehicle(dto: CreateVehicleDto): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.create({ data: dto });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `Pojazd o numerze rejestracyjnym ${dto.licensePlate} już istnieje`,
        );
      }

      throw error;
    }
  }

  async findAllByOrganization(organizationId: string): Promise<Vehicle[]> {
    if (!organizationId.trim()) {
      throw new BadRequestException('Identyfikator organizacji jest wymagany');
    }

    return this.prisma.vehicle.findMany({
      where: { organizationId },
      orderBy: { id: 'asc' },
    });
  }

  async updateStatus(
    vehicleId: number,
    status: VehicleStatus,
  ): Promise<Vehicle> {
    try {
      const updatedVehicle: Vehicle = await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status },
      });

      return updatedVehicle;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Nie znaleziono pojazdu o ID ${vehicleId}`);
      }

      throw error;
    }
  }
}
