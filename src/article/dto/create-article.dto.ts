import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ArticleCategory } from '../entities/article.entity';
import {
  BODY_MIN_LENGTH,
  TITLE_NOT_EMPTY,
  INVALID_CATEGORY,
  TITLE_NOT_STRING,
  BODY_NOT_STRING,
} from './dtos.consts';

export class CreateArticleDto {
  @IsString({ message: TITLE_NOT_STRING })
  @IsNotEmpty({ message: TITLE_NOT_EMPTY })
  title: string;

  @IsString({ message: BODY_NOT_STRING })
  @MinLength(10, { message: BODY_MIN_LENGTH })
  body: string;

  @IsEnum(ArticleCategory, { message: INVALID_CATEGORY })
  category?: ArticleCategory;

  author?: number;
}
