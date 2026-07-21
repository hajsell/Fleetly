import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(createVehicleDto);
  }

  @Get('organization/:organizationId')
  async findAllByOrganization(@Param('organizationId') organizationId: string) {
    return this.vehiclesService.findAllByOrganization(organizationId);
  }
}
