import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST ?? '',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/@database/entities/*.entity.js'],
  migrations: ['dist/@database/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config);
