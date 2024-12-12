import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1734007975430 implements MigrationInterface {
  name = 'Migration1734007975430'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."infra_instance_provider_enum" AS ENUM('local', 'aws')
        `)
    await queryRunner.query(`
            CREATE TABLE "infra_instance" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "name" character varying(40) NOT NULL,
                "provider" "public"."infra_instance_provider_enum" NOT NULL,
                "config" jsonb NOT NULL,
                CONSTRAINT "PK_8c8bb1a76f6b91d9076337b382a" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "infra_instance"."created_at" IS 'created at';
            COMMENT ON COLUMN "infra_instance"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "infra_instance"."name" IS 'instance name';
            COMMENT ON COLUMN "infra_instance"."provider" IS 'provider';
            COMMENT ON COLUMN "infra_instance"."config" IS 'instance config by provider'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "infra_instance"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."infra_instance_provider_enum"
        `)
  }
}
