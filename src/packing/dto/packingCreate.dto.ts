import { IsNotEmpty } from 'class-validator';

export class PackingCreateDto {
  @IsNotEmpty()
  packagingType: string; // Тип упаковки
  @IsNotEmpty()
  packagingLength: number; // Длина упаковки
  @IsNotEmpty()
  packagingWidth: number; // Ширина упаковки
  @IsNotEmpty()
  packagingHeight: number; // Высота упаковки
  @IsNotEmpty()
  quantityPerPackage: number; // Количество в упаковке
}
