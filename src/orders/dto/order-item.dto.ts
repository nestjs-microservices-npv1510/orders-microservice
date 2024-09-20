import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
