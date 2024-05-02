import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1714690935516 implements MigrationInterface {
    name = 'FirstMigration1714690935516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "currentStock" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operation_product" ("id" SERIAL NOT NULL, "operationId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_413a30e90d37fb33a4c99c53084" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."operation_type_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TABLE "operation" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "type" "public"."operation_type_enum" NOT NULL, "assigneeUserId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operation_product" ADD CONSTRAINT "FK_8fce3c610fb959cbb615aeef2e7" FOREIGN KEY ("operationId") REFERENCES "operation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operation_product" ADD CONSTRAINT "FK_a773324e91213a3a610315e76e9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operation" ADD CONSTRAINT "FK_db6eddb94d7058eb262a1962a33" FOREIGN KEY ("assigneeUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" DROP CONSTRAINT "FK_db6eddb94d7058eb262a1962a33"`);
        await queryRunner.query(`ALTER TABLE "operation_product" DROP CONSTRAINT "FK_a773324e91213a3a610315e76e9"`);
        await queryRunner.query(`ALTER TABLE "operation_product" DROP CONSTRAINT "FK_8fce3c610fb959cbb615aeef2e7"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
        await queryRunner.query(`DROP TABLE "operation_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
