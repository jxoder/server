import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727458270138 implements MigrationInterface {
    name = 'Migration1727458270138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."comfy_model_base_enum"
            RENAME TO "comfy_model_base_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."comfy_model_base_enum" AS ENUM('SD', 'PONY', 'SDXL', 'FLUX')
        `);
        await queryRunner.query(`
            ALTER TABLE "comfy_model"
            ALTER COLUMN "base" TYPE "public"."comfy_model_base_enum" USING "base"::"text"::"public"."comfy_model_base_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."comfy_model_base_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."comfy_model_base_enum_old" AS ENUM('SD', 'SDXL', 'FLUX')
        `);
        await queryRunner.query(`
            ALTER TABLE "comfy_model"
            ALTER COLUMN "base" TYPE "public"."comfy_model_base_enum_old" USING "base"::"text"::"public"."comfy_model_base_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."comfy_model_base_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."comfy_model_base_enum_old"
            RENAME TO "comfy_model_base_enum"
        `);
    }

}
