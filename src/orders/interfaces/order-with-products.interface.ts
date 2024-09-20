import { OrderStatus } from '@prisma/client';

export interface OrderWithProducts {
  items: {
    productId: number;
    quantity: number;
    price: number;
    name: any;
  }[];
  id: string;
  total: number;
  numItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
