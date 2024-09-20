import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePaymentId: string;

  @IsString()
  @IsUUID()
  orderId: string;

  @IsString()
  receiptUrl: string;
}
