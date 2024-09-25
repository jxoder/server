import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1727272098620 implements MigrationInterface {
  name = 'Migration1727272098620'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."comfy_model_type_enum" AS ENUM('CHECKPOINT', 'LORA', 'UNET')
        `)
    await queryRunner.query(`
            CREATE TYPE "public"."comfy_model_base_enum" AS ENUM('SD', 'SDXL', 'FLUX')
        `)
    await queryRunner.query(`
            CREATE TABLE "comfy_model" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "type" "public"."comfy_model_type_enum" NOT NULL,
                "base" "public"."comfy_model_base_enum" NOT NULL,
                "value" character varying NOT NULL,
                "perm_lv" integer NOT NULL DEFAULT '10',
                CONSTRAINT "PK_f2498e0225e7d9da7b39ce9c71e" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "comfy_model"."created_at" IS 'created at';
            COMMENT ON COLUMN "comfy_model"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "comfy_model"."id" IS 'id';
            COMMENT ON COLUMN "comfy_model"."name" IS 'name';
            COMMENT ON COLUMN "comfy_model"."type" IS 'model type (checkpoint, LoRA, ...)';
            COMMENT ON COLUMN "comfy_model"."base" IS 'base type (SD, SDXL, FLUX...)';
            COMMENT ON COLUMN "comfy_model"."value" IS 'real entity value';
            COMMENT ON COLUMN "comfy_model"."perm_lv" IS 'permission level (user.roleLv)'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "comfy_model"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."comfy_model_base_enum"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."comfy_model_type_enum"
        `)
  }
}
