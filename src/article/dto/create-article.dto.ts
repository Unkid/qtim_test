import { IsEnum, IsString, MinLength } from 'class-validator';
import { ArticleCategory } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString()
  @MinLength(1, { message: '' })
  title: string;

  @IsString()
  @MinLength(10, { message: '' })
  body: string;

  @IsEnum(ArticleCategory)
  category?: ArticleCategory;

  @IsString()
  author?: number;
}
