import { Controller, Get, Post, Body, ParseIntPipe, Query, SetMetadata } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { RemainingQuantity, Status } from './type';
import { PurchaseDate } from './type';

@SetMetadata('requireLogin', true)
@SetMetadata('permission', 'equipment:handle')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post('create')
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get('list')
  list(
    @Query('pageNo', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) size: number,
    @Query('name') name: string,
    @Query('type') type: string,
    @Query('status') status: Status,
    @Query('description') description: string,
    @Query('price') price: RemainingQuantity,
    @Query('remainingQuantity')
    remainingQuantity: RemainingQuantity,
    @Query('purchaseDate')
    purchaseDate: PurchaseDate,
  ) {
    return this.equipmentService.list(
      page,
      size,
      name,
      type,
      status,
      description,
      price,
      remainingQuantity,
      purchaseDate,
    );
  }
}
