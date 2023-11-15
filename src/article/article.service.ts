import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '../auth/user.service';
import { FORBIDDEN_ACTION, NOT_FOUND } from './article.consts';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private userService: UserService,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<any> {
    const article = new Article();
    article.title = createArticleDto.title;
    article.body = createArticleDto.body;
    if (createArticleDto.category) article.category = createArticleDto.category;
    const user = await this.userService.findById(createArticleDto.author);
    if (!user) throw new ForbiddenException(FORBIDDEN_ACTION);
    article.author = user;
    await this.articleRepository.save(article);
    return { ...article, author: { username: user.username } };
  }

  findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Article[], number]> {
    return this.articleRepository.findAndCount({
      select: {
        author: {
          username: true,
        },
      },
      relations: {
        author: true,
      },
      order: {
        created_at: 'DESC',
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      select: {
        author: {
          username: true,
        },
      },
      relations: {
        author: true,
      },
    });
    if (!article) throw new NotFoundException(NOT_FOUND);
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOneBy({
      id,
    });
    if (!article) throw new NotFoundException(NOT_FOUND);
    this.articleRepository.update(id, updateArticleDto);
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOneBy({
      id,
    });
    if (!article) throw new NotFoundException(NOT_FOUND);
    this.articleRepository.delete(id);
  }
}
