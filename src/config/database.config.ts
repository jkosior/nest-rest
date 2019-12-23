export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}
    @${process.env.DB_HOST || 'localhost'}
    :${process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432}
    /${process.env.DB_NAME}`.replace(/\s/g, ''),
  entities: [__dirname + '/../**/**/!(*.d).entity.{ts,js}'],
  logging: false,
  synchronize: false,
  retryAttempts: true,
};
