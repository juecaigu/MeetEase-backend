import { Controller, Post, Body, SetMetadata } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { SearchEquipmentDto } from './dto/search-equipment.dto';

@SetMetadata('requireLogin', true)
@SetMetadata('permission', 'equipment:handle')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post('create')
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Post('list')
  list(@Body() searchEquipmentDto: SearchEquipmentDto) {
    return this.equipmentService.list(searchEquipmentDto);
  }
}
