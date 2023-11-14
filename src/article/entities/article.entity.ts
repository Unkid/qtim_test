import { User } from 'src/auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

export enum ArticleCategory {
  Сrime = 'Преступность',
  Culture = 'Культура',
  Disasters = 'Происшествия',
  Politics = 'Политика',
  Sport = 'Спорт',
  Weather = 'Погода',
  Locals = 'Местные',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  body: string;

  @Column({
    type: 'enum',
    enum: ArticleCategory,
    default: ArticleCategory.Locals,
  })
  category: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
  @ManyToOne(() => User, (user) => user.articles)
  author: User;
}
