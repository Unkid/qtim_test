import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPgConfig } from './configs/postgres.config';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPgConfig,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    ArticleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
