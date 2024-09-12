import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Migration to create the pg_session table for storing session data.
 */
export class Migration1726135436168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "pg_session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
        ) WITH (OIDS=FALSE);
        `)
    await queryRunner.query(`
        ALTER TABLE "pg_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
        `)
    await queryRunner.query(`
        CREATE INDEX "IDX_session_expire" ON "pg_session" ("expire");
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "public"."IDX_session_expire";
      `)
    await queryRunner.query(`
        DROP TABLE "pg_session"
        `)
  }
}
