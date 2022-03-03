const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initialSchema1645034073760 {
    name = 'initialSchema1645034073760';

    async up(queryRunner) {
        await queryRunner.query(
            `CREATE TABLE "tile_data" ("id" integer PRIMARY KEY NOT NULL, "name" text, "image_data" text, "image_data_live" text, "url" text, "price" integer, "lastUpdate" integer, "owner" text, "approved" text, "blacklist" boolean)`
        );
        await queryRunner.query(
            `CREATE TABLE "whitelist_data" ("id" integer PRIMARY KEY NOT NULL, "address" text)`
        );
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tile_data"`);
        await queryRunner.query(`DROP TABLE "whitelist_data"`);
    }
};
