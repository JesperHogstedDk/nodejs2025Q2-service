import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserNotUnique1750838126013 implements MigrationInterface {
  name = 'UserNotUnique1750838126013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "UQ_7d7ba3f7344bde97dd5f2bd60ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "version" SET DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "version" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "UQ_7d7ba3f7344bde97dd5f2bd60ea" UNIQUE ("login")`,
    );
  }
}
