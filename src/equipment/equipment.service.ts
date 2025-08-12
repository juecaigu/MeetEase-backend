import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentVo } from './vo/equipment.vo';
import { SearchEquipmentDto } from './dto/search-equipment.dto';
import { Expression } from 'src/type/type';

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

  async list(searchEquipmentDto: SearchEquipmentDto) {
    const { pageNo, pageSize, name, type, status, description, price, remainingQuantity, purchaseDate } =
      searchEquipmentDto;
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
    if (price?.expression && price?.value !== undefined) {
      console.log('adsffeafeaefagaeaeef', price);
      const { expression, value } = price;
      if (expression === Expression.BETWEEN) {
        queryBuilder.where(`equipment.price BETWEEN :price1 AND :price2`, {
          price1: value[0] as number,
          price2: value[1] as number,
        });
      } else {
        queryBuilder.where(`equipment.price ${expression} :price`, {
          price: value,
        });
      }
    }
    if (remainingQuantity?.expression && remainingQuantity?.value !== undefined) {
      const { expression, value } = remainingQuantity;
      if (expression === Expression.BETWEEN) {
        queryBuilder.where(`equipment.remaining_quantity BETWEEN :remainingQuantity1 AND :remainingQuantity2`, {
          remainingQuantity1: value[0] as number,
          remainingQuantity2: value[1] as number,
        });
      } else {
        queryBuilder.where(`equipment.remaining_quantity ${expression} :remainingQuantity`, {
          remainingQuantity: value,
        });
      }
    }
    if (purchaseDate?.expression && purchaseDate?.value !== undefined) {
      const { expression, value } = purchaseDate;
      if (expression === Expression.BETWEEN) {
        queryBuilder.where(`equipment.purchase_date BETWEEN :purchaseDate1 AND :purchaseDate2`, {
          purchaseDate1: value[0] as Date,
          purchaseDate2: value[1] as Date,
        });
      } else {
        queryBuilder.where(`equipment.purchase_date ${expression} :purchaseDate`, {
          purchaseDate: value,
        });
      }
    }
    const [equipments, total] = await queryBuilder
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return {
      equipments: equipments.map((equipment) => {
        const equipmentVo = new EquipmentVo();
        equipmentVo.id = equipment.id;
        equipmentVo.name = equipment.name;
        equipmentVo.type = equipment.type;
        equipmentVo.code = equipment.code;
        equipmentVo.status = equipment.status;
        equipmentVo.remainingQuantity = equipment.remainingQuantity;
        equipmentVo.purchaseDate = equipment.purchaseDate;
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
