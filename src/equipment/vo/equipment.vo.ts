import { Status } from '../type';

export class EquipmentVo {
  id: number;
  name: string;
  type: string;
  code: string;
  status: Status;
  remainingQuantity: number;
  purchaseDate: Date;
  price: number;
  quantity: number;
  supplier?: string;
  description?: string;
  //   image?: string;
}
