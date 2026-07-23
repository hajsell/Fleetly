import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationType,
  TransportOrder,
  TransportOrderStatus,
  VehicleStatus,
} from '@prisma/client';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { CreateTransportOrderDto } from './dto/create-transport-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class TransportOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    authUser: AuthUser,
    dto: CreateTransportOrderDto,
  ): Promise<TransportOrder> {
    this.assertOrganizationType(authUser, OrganizationType.CUSTOMER);

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('Termin przejazdu musi być w przyszłości.');
    }

    return this.prisma.transportOrder.create({
      data: {
        customerOrganizationId: authUser.organizationId,
        createdById: authUser.userId,
        pickupAddress: dto.pickupAddress.trim(),
        dropoffAddress: dto.dropoffAddress.trim(),
        scheduledAt,
        passengerCount: dto.passengerCount,
      },
    });
  }

  findMine(authUser: AuthUser): Promise<TransportOrder[]> {
    const organizationFilter =
      authUser.organizationType === OrganizationType.CUSTOMER
        ? { customerOrganizationId: authUser.organizationId }
        : { providerOrganizationId: authUser.organizationId };

    return this.prisma.transportOrder.findMany({
      where: organizationFilter,
      include: {
        customerOrganization: { select: { id: true, name: true } },
        providerOrganization: { select: { id: true, name: true } },
        vehicle: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  findAvailable(authUser: AuthUser): Promise<TransportOrder[]> {
    this.assertOrganizationType(authUser, OrganizationType.PROVIDER);

    return this.prisma.transportOrder.findMany({
      where: {
        status: TransportOrderStatus.PENDING,
        providerOrganizationId: null,
      },
      include: {
        customerOrganization: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(authUser: AuthUser, orderId: number): Promise<TransportOrder> {
    const order = await this.prisma.transportOrder.findUnique({
      where: { id: orderId },
      include: {
        customerOrganization: { select: { id: true, name: true } },
        providerOrganization: { select: { id: true, name: true } },
        vehicle: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Zlecenie nie istnieje.');
    }

    const isCustomer = order.customerOrganizationId === authUser.organizationId;
    const isAssignedProvider =
      order.providerOrganizationId === authUser.organizationId;
    const isAvailableForProvider =
      authUser.organizationType === OrganizationType.PROVIDER &&
      order.providerOrganizationId === null &&
      order.status === TransportOrderStatus.PENDING;

    if (!isCustomer && !isAssignedProvider && !isAvailableForProvider) {
      throw new NotFoundException('Zlecenie nie istnieje.');
    }

    return order;
  }

  async accept(authUser: AuthUser, orderId: number): Promise<TransportOrder> {
    this.assertOrganizationType(authUser, OrganizationType.PROVIDER);

    const result = await this.prisma.transportOrder.updateMany({
      where: {
        id: orderId,
        status: TransportOrderStatus.PENDING,
        providerOrganizationId: null,
      },
      data: {
        providerOrganizationId: authUser.organizationId,
        status: TransportOrderStatus.ACCEPTED,
      },
    });

    if (result.count === 0) {
      const exists = await this.prisma.transportOrder.findUnique({
        where: { id: orderId },
        select: { id: true },
      });

      if (!exists) {
        throw new NotFoundException('Zlecenie nie istnieje.');
      }

      throw new ConflictException(
        'Zlecenie zostało już przyjęte albo nie jest dostępne.',
      );
    }

    return this.prisma.transportOrder.findUniqueOrThrow({
      where: { id: orderId },
    });
  }

  async assignVehicle(
    authUser: AuthUser,
    orderId: number,
    dto: AssignVehicleDto,
  ): Promise<TransportOrder> {
    this.assertOrganizationType(authUser, OrganizationType.PROVIDER);

    const order = await this.prisma.transportOrder.findFirst({
      where: {
        id: orderId,
        providerOrganizationId: authUser.organizationId,
      },
    });

    if (!order) {
      throw new NotFoundException('Zlecenie nie istnieje.');
    }

    if (order.status !== TransportOrderStatus.ACCEPTED) {
      throw new ConflictException(
        'Pojazd można przypisać tylko do zaakceptowanego zlecenia.',
      );
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: dto.vehicleId,
        organizationId: authUser.organizationId,
        status: VehicleStatus.ACTIVE,
      },
    });

    if (!vehicle) {
      throw new BadRequestException(
        'Wybrany pojazd nie istnieje lub nie jest aktywny.',
      );
    }

    if (vehicle.seatCapacity < order.passengerCount) {
      throw new BadRequestException(
        'Wybrany pojazd ma za mało miejsc dla pasażerów.',
      );
    }

    return this.prisma.transportOrder.update({
      where: { id: order.id },
      data: { vehicleId: vehicle.id },
    });
  }

  async updateStatus(
    authUser: AuthUser,
    orderId: number,
    dto: UpdateOrderStatusDto,
  ): Promise<TransportOrder> {
    const order = await this.prisma.transportOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Zlecenie nie istnieje.');
    }

    this.assertStatusChangeAllowed(authUser, order, dto.status);

    return this.prisma.transportOrder.update({
      where: { id: order.id },
      data: { status: dto.status },
    });
  }

  private assertStatusChangeAllowed(
    authUser: AuthUser,
    order: TransportOrder,
    nextStatus: TransportOrderStatus,
  ): void {
    const isCustomer = order.customerOrganizationId === authUser.organizationId;
    const isProvider = order.providerOrganizationId === authUser.organizationId;

    const customerCanCancel =
      isCustomer &&
      nextStatus === TransportOrderStatus.CANCELLED &&
      (order.status === TransportOrderStatus.PENDING ||
        order.status === TransportOrderStatus.ACCEPTED);

    const providerCanStart =
      isProvider &&
      order.status === TransportOrderStatus.ACCEPTED &&
      nextStatus === TransportOrderStatus.IN_PROGRESS;

    const providerCanComplete =
      isProvider &&
      order.status === TransportOrderStatus.IN_PROGRESS &&
      nextStatus === TransportOrderStatus.COMPLETED;

    const providerCanCancel =
      isProvider &&
      nextStatus === TransportOrderStatus.CANCELLED &&
      (order.status === TransportOrderStatus.ACCEPTED ||
        order.status === TransportOrderStatus.IN_PROGRESS);

    if (
      !customerCanCancel &&
      !providerCanStart &&
      !providerCanComplete &&
      !providerCanCancel
    ) {
      throw new ForbiddenException('Niedozwolona zmiana statusu zlecenia.');
    }

    if (providerCanStart && order.vehicleId === null) {
      throw new ConflictException(
        'Przed rozpoczęciem zlecenia należy przypisać pojazd.',
      );
    }
  }

  private assertOrganizationType(
    authUser: AuthUser,
    expectedType: OrganizationType,
  ): void {
    if (authUser.organizationType !== expectedType) {
      throw new ForbiddenException(
        expectedType === OrganizationType.CUSTOMER
          ? 'Tylko klient może tworzyć zlecenia.'
          : 'Ta operacja jest dostępna tylko dla przewoźnika.',
      );
    }
  }
}
