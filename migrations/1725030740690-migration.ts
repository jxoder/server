import { MigrationInterface, QueryRunner } from 'typeorm'

// TODO: revert this migration. not used
export class Migration1725030740690 implements MigrationInterface {
  name = 'Migration1725030740690'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."telegram_user_role_enum" AS ENUM('ANONYMOUS', 'USER', 'ADMIN', 'MASTER')
        `)
    await queryRunner.query(`
            CREATE TABLE "telegram_user" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" bigint NOT NULL,
                "first_name" character varying,
                "username" character varying,
                "language_code" character varying,
                "role" "public"."telegram_user_role_enum" NOT NULL DEFAULT 'ANONYMOUS',
                CONSTRAINT "PK_8e00b1def3edd3510248136f820" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "telegram_user"."created_at" IS 'created at';
            COMMENT ON COLUMN "telegram_user"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "telegram_user"."id" IS 'telegram user id';
            COMMENT ON COLUMN "telegram_user"."first_name" IS 'firstName';
            COMMENT ON COLUMN "telegram_user"."username" IS 'username';
            COMMENT ON COLUMN "telegram_user"."language_code" IS 'languageCode';
            COMMENT ON COLUMN "telegram_user"."role" IS 'role' 
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "telegram_user"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."telegram_user_role_enum"
        `)
  }
}
