import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/auth/entities/user.entity';

export const getPgConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    password: configService.get('POSTGRES_PASSWORD'),
    username: configService.get('POSTGRES_USERNAME'),
    entities: [Article, User],
    database: configService.get('POSTGRES_DB'),
    synchronize: true,
    logging: true,
    autoLoadEntities: true,
  };
};
