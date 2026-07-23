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
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleStatusDto } from './dto/update-vehicle-status.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@CurrentUser() authUser: AuthUser, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(authUser, dto);
  }

  @Get()
  findAll(@CurrentUser() authUser: AuthUser) {
    return this.vehiclesService.findAll(authUser);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() authUser: AuthUser,
    @Param('id', ParseIntPipe) vehicleId: number,
    @Body() dto: UpdateVehicleStatusDto,
  ) {
    return this.vehiclesService.updateStatus(authUser, vehicleId, dto);
  }
}
