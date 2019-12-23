//typeorm-cli doesn't use nest-js config, that's why we're providing additional config file for typeorm-cli
//typeorm-cli will be used for running db migrations

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'nest_user',
  password: process.env.DB_PASSWORD || 'nest_password',
  database: process.env.DB_NAME || 'nest_db',
  port: parseInt(process.env.DB_PORT) || 5432,
  entities: [
    'src/**/**.entity.ts'
  ],
  logging: true,
  migrationsTableName: "nest_rest_migration_table",
  migrations: ['./migration/*.ts'],
  synchronize: false,
  cli: {
    "migrationsDir": "./migration",
  }
};