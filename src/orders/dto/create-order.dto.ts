import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Type(() => Number)
  public id: number;
}
