import {MigrationInterface, QueryRunner} from "typeorm";

export class new1579610852345 implements MigrationInterface {
    name = 'new1579610852345'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "isCheckedOut" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "isCheckedOut"`, undefined);
    }

}
