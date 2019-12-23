import {MigrationInterface, QueryRunner} from "typeorm";

export class prices1577065567602 implements MigrationInterface {
    name = 'prices1577065567602'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" json NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" character varying NOT NULL`, undefined);
    }

}
