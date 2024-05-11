import { IsNotEmpty, IsOptional } from 'class-validator';

export class CharacteristicsDto {
  @IsNotEmpty()
  manufacturer: string; // Производитель

  @IsNotEmpty()
  color: string; // Цвет

  @IsNotEmpty()
  material: string; // Материал

  @IsNotEmpty()
  style: string; // Стиль

  @IsOptional()
  purpose: string; // Назначение

  @IsOptional()
  application: string; // Применение

  @IsOptional()
  countryOfOrigin: string; // Страна-производитель

  @IsOptional()
  length: number; // Длина, мм

  @IsOptional()
  width: number; // Ширина, мм

  @IsOptional()
  thickness: number; // Толщина, мм
}

