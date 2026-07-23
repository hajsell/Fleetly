import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { CreateTransportOrderDto } from './dto/create-transport-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { TransportOrdersService } from './transport-orders.service';

@UseGuards(JwtAuthGuard)
@Controller('transport-orders')
export class TransportOrdersController {
  constructor(
    private readonly transportOrdersService: TransportOrdersService,
  ) {}

  @Post()
  create(
    @CurrentUser() authUser: AuthUser,
    @Body() dto: CreateTransportOrderDto,
  ) {
    return this.transportOrdersService.create(authUser, dto);
  }

  @Get()
  findMine(@CurrentUser() authUser: AuthUser) {
    return this.transportOrdersService.findMine(authUser);
  }

  @Get('available')
  findAvailable(@CurrentUser() authUser: AuthUser) {
    return this.transportOrdersService.findAvailable(authUser);
  }

  @Get(':id')
  findOne(
    @CurrentUser() authUser: AuthUser,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.transportOrdersService.findOne(authUser, orderId);
  }

  @Patch(':id/accept')
  accept(
    @CurrentUser() authUser: AuthUser,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.transportOrdersService.accept(authUser, orderId);
  }

  @Patch(':id/vehicle')
  assignVehicle(
    @CurrentUser() authUser: AuthUser,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: AssignVehicleDto,
  ) {
    return this.transportOrdersService.assignVehicle(authUser, orderId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() authUser: AuthUser,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.transportOrdersService.updateStatus(authUser, orderId, dto);
  }
}
