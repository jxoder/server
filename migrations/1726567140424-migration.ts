import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1726567140424 implements MigrationInterface {
  name = 'Migration1726567140424'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."ai_image_task_status_enum" AS ENUM('WAITING', 'ACTIVE', 'SUCCESS', 'FAILED')
        `)
    await queryRunner.query(`
            CREATE TABLE "ai_image_task" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "job_id" character varying NOT NULL,
                "status" "public"."ai_image_task_status_enum" NOT NULL DEFAULT 'WAITING',
                "error" text,
                "user_id" integer,
                CONSTRAINT "PK_50beaaca81045b72986553535a1" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "ai_image_task"."created_at" IS 'created at';
            COMMENT ON COLUMN "ai_image_task"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "ai_image_task"."id" IS 'id';
            COMMENT ON COLUMN "ai_image_task"."job_id" IS 'job id';
            COMMENT ON COLUMN "ai_image_task"."status" IS 'status';
            COMMENT ON COLUMN "ai_image_task"."error" IS 'error message';
            COMMENT ON COLUMN "ai_image_task"."user_id" IS 'user id (not fk)'
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_9127730ae07a076f79ada32a14" ON "ai_image_task" ("job_id")
        `)
    await queryRunner.query(`
            CREATE TABLE "ai_image" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "key" character varying(100) NOT NULL,
                "task_id" integer NOT NULL,
                CONSTRAINT "PK_a85e38ec8e73b07fe73aeb81866" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "ai_image"."created_at" IS 'created at';
            COMMENT ON COLUMN "ai_image"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "ai_image"."id" IS 'id';
            COMMENT ON COLUMN "ai_image"."key" IS 'key';
            COMMENT ON COLUMN "ai_image"."task_id" IS 'task id'
        `)
    await queryRunner.query(`
            ALTER TABLE "ai_image"
            ADD CONSTRAINT "FK_50beaaca81045b72986553535a1" FOREIGN KEY ("task_id") REFERENCES "ai_image_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ai_image" DROP CONSTRAINT "FK_50beaaca81045b72986553535a1"
        `)
    await queryRunner.query(`
            DROP TABLE "ai_image"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9127730ae07a076f79ada32a14"
        `)
    await queryRunner.query(`
            DROP TABLE "ai_image_task"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."ai_image_task_status_enum"
        `)
  }
}
