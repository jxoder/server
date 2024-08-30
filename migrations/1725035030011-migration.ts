import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1725035030011 implements MigrationInterface {
  name = 'Migration1725035030011'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "my_lab_kv" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "key" character varying(40) NOT NULL,
                "raw" jsonb NOT NULL,
                CONSTRAINT "PK_27e95347ad136945f6a2d8fb878" PRIMARY KEY ("key")
            );
            COMMENT ON COLUMN "my_lab_kv"."created_at" IS 'created at';
            COMMENT ON COLUMN "my_lab_kv"."updated_at" IS 'updated at';
            COMMENT ON COLUMN "my_lab_kv"."key" IS 'key';
            COMMENT ON COLUMN "my_lab_kv"."raw" IS 'value'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "my_lab_kv"
        `)
  }
}
