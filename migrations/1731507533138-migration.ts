import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1731507533138 implements MigrationInterface {
  name = 'Migration1731507533138'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."ai_image_history_status_enum" AS ENUM('WAITING', 'PROGRESSING', 'SUCCESS', 'FAILED')
        `)
    await queryRunner.query(`
            CREATE TABLE "ai_image_history" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "payload" jsonb NOT NULL,
                "status" "public"."ai_image_history_status_enum" NOT NULL DEFAULT 'WAITING',
                "error" text,
                "job_id" character varying NOT NULL,
                "uniq_key" character varying NOT NULL,
                CONSTRAINT "PK_aac9bfad2423f0bc29c5d3e84f8" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "ai_image_history"."created_at" IS 'created at';
            COMMENT ON COLUMN "ai_image_history"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "ai_image_history"."id" IS 'id';
            COMMENT ON COLUMN "ai_image_history"."payload" IS 'request payload';
            COMMENT ON COLUMN "ai_image_history"."status" IS 'status';
            COMMENT ON COLUMN "ai_image_history"."error" IS 'error message';
            COMMENT ON COLUMN "ai_image_history"."job_id" IS 'queue job id';
            COMMENT ON COLUMN "ai_image_history"."uniq_key" IS 'requester uniq key'
        `)
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_9e1bf91c8469f8066310d60535" ON "ai_image_history" ("job_id")
        `)
    await queryRunner.query(`
            CREATE TABLE "ai_image_file" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "key" character varying NOT NULL,
                "mime_type" character varying NOT NULL,
                "history_id" integer NOT NULL,
                CONSTRAINT "PK_3d0553a1c6548b061600552b613" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "ai_image_file"."created_at" IS 'created at';
            COMMENT ON COLUMN "ai_image_file"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "ai_image_file"."id" IS 'id';
            COMMENT ON COLUMN "ai_image_file"."key" IS 'object key';
            COMMENT ON COLUMN "ai_image_file"."mime_type" IS 'mime type';
            COMMENT ON COLUMN "ai_image_file"."history_id" IS 'history id'
        `)
    await queryRunner.query(`
            ALTER TABLE "ai_image_file"
            ADD CONSTRAINT "FK_10dd2aa69fb101ecb946513b27f" FOREIGN KEY ("history_id") REFERENCES "ai_image_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ai_image_file" DROP CONSTRAINT "FK_10dd2aa69fb101ecb946513b27f"
        `)
    await queryRunner.query(`
            DROP TABLE "ai_image_file"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9e1bf91c8469f8066310d60535"
        `)
    await queryRunner.query(`
            DROP TABLE "ai_image_history"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."ai_image_history_status_enum"
        `)
  }
}
