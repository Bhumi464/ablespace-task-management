import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  lead: string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  members?: string[];
}