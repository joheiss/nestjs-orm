import {MigrationInterface, QueryRunner} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class AddDummyOrgAndUser1550417104238 implements MigrationInterface {

    private readonly userId = 'dummy@delete.me';
    private readonly password = 'deletemetoday';
    private readonly roles = 'super';
    private readonly orgId = 'DMY';
    private readonly orgName = 'Dummy';

    public async up(queryRunner: QueryRunner): Promise<any> {

        const anyOrg = await queryRunner.query(`SELECT * FROM "organizations"`);
        if (!anyOrg || !anyOrg.length) {
            console.log(`Adding dummy organization ...`);
            const dummyOrg = await queryRunner.query(`SELECT * FROM "organizations" WHERE id = '${this.orgId}'`);
            if (!dummyOrg || !dummyOrg.length) {
                await queryRunner.query(
                        `INSERT INTO "organizations" ("id", "name") VALUES($1, $2)`, [this.orgId, this.orgName]
                );
            }
        } else {
            console.log(`There are already organizations available in the database.`);
        }

        const anySuperUser = await queryRunner.query(`SELECT * FROM "users" WHERE roles LIKE '%super%'`);
        if (!anySuperUser || !anySuperUser.length) {
            console.log(`Adding dummy user ...`);
            const dummyUser = await queryRunner.query(`SELECT * FROM "users" WHERE id = '${this.userId}'`);
            if (!dummyUser || !dummyUser.length) {
                const hashedPassword = await bcrypt.hash(this.password, 10);
                await queryRunner.query(
                    `INSERT INTO "users" ("id", "password", "organization", "roles")
                     VALUES($1, $2, $3, $4)`, [this.userId, hashedPassword, this.orgId, this.roles]
                );
            }
        } else {
            console.log(`There are already super users available in the database.`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const dummyOrg = await queryRunner.query(`SELECT * FROM "organizations" WHERE id = '${this.orgId}'`);
        if (dummyOrg && dummyOrg.length) {
            await queryRunner.query(`DELETE FROM "organizations" WHERE id = '${this.orgId}'`);
        }
        const dummyUser = await queryRunner.query(`SELECT * FROM "users" WHERE id = '${this.userId}'`);
        if (dummyUser && dummyUser.length) {
            await queryRunner.query(`DELETE FROM "users" WHERE id = '${this.userId}'`);
        }
    }
}
