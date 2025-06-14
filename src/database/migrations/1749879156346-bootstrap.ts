import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bootstrap1749879156346 implements MigrationInterface {
  name = 'Bootstrap1749879156346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_7c07e38dd0d817a103966c5876e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_715d259ae16fb1e669fb69ef155" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_51ee6369b97c61b87ff510bcd33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "FavoriteTrack" ("id" SERIAL NOT NULL, "trackId" uuid, CONSTRAINT "REL_f80dbe9b61f44110fc5d5484c2" UNIQUE ("trackId"), CONSTRAINT "PK_5e3cb5c8fd3e2ce6bf93f6360d4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "FavoriteArtist" ("id" SERIAL NOT NULL, "artistId" uuid, CONSTRAINT "REL_c9db903d5102804fb059625109" UNIQUE ("artistId"), CONSTRAINT "PK_418e19e4c6a008b389dea8a79fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "FavoriteAlbum" ("id" SERIAL NOT NULL, "albumId" uuid, CONSTRAINT "REL_40724e455b668d3aa5cba365bc" UNIQUE ("albumId"), CONSTRAINT "PK_532d31d4c902d3bed977bac5722" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Album" ADD CONSTRAINT "FK_7e5f0ed6b42c66789d4435ba8eb" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Track" ADD CONSTRAINT "FK_aa1f298d1ff6728d65b4232713f" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Track" ADD CONSTRAINT "FK_8cd82637ad035c862207206de57" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FK_f80dbe9b61f44110fc5d5484c2c" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FavoriteArtist" ADD CONSTRAINT "FK_c9db903d5102804fb059625109a" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FavoriteAlbum" ADD CONSTRAINT "FK_40724e455b668d3aa5cba365bce" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FavoriteAlbum" DROP CONSTRAINT "FK_40724e455b668d3aa5cba365bce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FavoriteArtist" DROP CONSTRAINT "FK_c9db903d5102804fb059625109a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FavoriteTrack" DROP CONSTRAINT "FK_f80dbe9b61f44110fc5d5484c2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Track" DROP CONSTRAINT "FK_8cd82637ad035c862207206de57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Track" DROP CONSTRAINT "FK_aa1f298d1ff6728d65b4232713f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Album" DROP CONSTRAINT "FK_7e5f0ed6b42c66789d4435ba8eb"`,
    );
    await queryRunner.query(`DROP TABLE "FavoriteAlbum"`);
    await queryRunner.query(`DROP TABLE "FavoriteArtist"`);
    await queryRunner.query(`DROP TABLE "FavoriteTrack"`);
    await queryRunner.query(`DROP TABLE "Track"`);
    await queryRunner.query(`DROP TABLE "Album"`);
    await queryRunner.query(`DROP TABLE "Artist"`);
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
