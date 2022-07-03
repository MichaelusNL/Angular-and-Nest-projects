import { IsNotEmpty } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  image: string;
}
