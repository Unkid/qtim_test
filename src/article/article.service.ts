import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    console.log('This action adds a new article');
    const article = new Article();
    article.title = createArticleDto.title;
    article.body = createArticleDto.body;
    if (createArticleDto.category) article.category = createArticleDto.category;
    return this.articleRepository.save(article);
  }

  findAll() {
    console.log(`This action returns all article`);
    return this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article> {
    console.log(`This action returns a #${id} article`);
    const article = await this.articleRepository.findOneBy({ id });
    if (!article) throw new NotFoundException('');
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    console.log(`This action updates a #${id} article`);
    const article = await this.articleRepository.findOneBy({
      id,
    });
    if (!article) throw new NotFoundException('');
    return this.articleRepository.update(id, updateArticleDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    console.log(`This action removes a #${id} article`);
    const article = await this.articleRepository.findOneBy({
      id,
    });
    if (!article) throw new NotFoundException('');
    return this.articleRepository.delete(id);
  }
}
