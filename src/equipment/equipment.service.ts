import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseDate, RemainingQuantity, Status } from './type';
import { EquipmentVo } from './vo/equipment.vo';

@Injectable()
export class EquipmentService {
  constructor(@InjectRepository(Equipment) private readonly equipmentRepository: Repository<Equipment>) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    const prevEquipment = await this.equipmentRepository.findOne({ where: { code: createEquipmentDto.code } });
    if (prevEquipment) {
      throw new BadRequestException('设备编号已存在');
    }
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    await this.equipmentRepository.save(equipment);
    return '设备创建成功';
  }

  async list(
    page: number,
    size: number,
    name: string,
    type: string,
    status: Status,
    description: string,
    price: RemainingQuantity,
    remainingQuantity: RemainingQuantity,
    purchaseDate: PurchaseDate,
  ) {
    const queryBuilder = this.equipmentRepository.createQueryBuilder('equipment');
    if (name) {
      queryBuilder.where('equipment.name LIKE :name', { name: `%${name}%` });
    }
    if (type) {
      queryBuilder.where('equipment.type LIKE :type', { type: `%${type}%` });
    }
    if (status) {
      queryBuilder.where('equipment.status = :status', { status });
    }
    if (description) {
      queryBuilder.where('equipment.description LIKE :description', { description: `%${description}%` });
    }
    if (remainingQuantity?.expression && remainingQuantity?.value !== undefined) {
      const { expression, value } = remainingQuantity;
      queryBuilder.where(`equipment.remaining_quantity ${expression} :remainingQuantity`, {
        remainingQuantity: value,
      });
    }
    if (price?.expression && price?.value !== undefined) {
      const { expression, value } = price;
      queryBuilder.where(`equipment.price ${expression} :price`, {
        price: value,
      });
    }
    if (purchaseDate?.expression && purchaseDate?.value !== undefined) {
      const { expression, value } = purchaseDate;
      queryBuilder.where(`equipment.purchase_date ${expression} :purchaseDate`, {
        purchaseDate: value,
      });
    }
    const [equipments, total] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
    return {
      equipments: equipments.map((equipment) => {
        const equipmentVo = new EquipmentVo();
        equipmentVo.id = equipment.id;
        equipmentVo.name = equipment.name;
        equipmentVo.type = equipment.type;
        equipmentVo.code = equipment.code;
        equipmentVo.status = equipment.status;
        equipmentVo.remainingQuantity = equipment.remaining_quantity;
        equipmentVo.purchaseDate = equipment.purchase_date;
        equipmentVo.price = equipment.price;
        equipmentVo.quantity = equipment.quantity;
        equipmentVo.supplier = equipment.supplier;
        equipmentVo.description = equipment.description;
        return equipmentVo;
      }),
      total,
    };
  }
}
