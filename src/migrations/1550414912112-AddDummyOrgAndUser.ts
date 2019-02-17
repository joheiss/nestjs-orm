
import {MigrationInterface, QueryRunner} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class AddDummyOrgAndUser1550414912112 implements MigrationInterface {

    private readonly userId = 'dummy@delete.me';
    private readonly password = 'deletemetoday';
    private readonly roles = 'super';
    private readonly orgId = 'DMY';
    private readonly orgName = 'Dummy';

    public async up(queryRunner: QueryRunner): Promise<any> {

        const anyOrg = await queryRunner.query(`SELECT * FROM "organizations"`);
        if (anyOrg) {
            console.log(`Adding dummy organization ...`);
            const dummyOrg = await queryRunner.query(`SELECT * FROM "organizations" WHERE id = "?"`, [this.orgId]);
            if (!dummyOrg) {
                await queryRunner.query(
                        `INSERT INTO "organizations" (id, name) VALUES("?", "?")`,
                        [this.orgId, this.orgName]
                );
            }
        } else {
            console.log(`There are already organizations available in the database.`);
        }

        const anySuperUser = await queryRunner.query(`SELECT * FROM "users" WHERE roles LIKE '%super%'`);
        if (anySuperUser) {
            console.log(`Adding dummy user ...`);
            const dummyUser = await queryRunner.query(`SELECT * FROM "users" WHERE id = "?"`, [this.userId]);
            if (!dummyUser) {
                const hashedPassword = await bcrypt.hash(this.password, 10);
                await queryRunner.query(
                    `INSERT INTO "users" (id, password, organisation, roles) VALUES("?", "?", "?", "?")`,
                    [this.userId, hashedPassword, this.orgId, this.roles]
                );
            }
        } else {
            console.log(`There are already super users available in the database.`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const dummyOrg = await queryRunner.query(`SELECT * FROM "organizations" WHERE id = "?"`, [this.orgId]);
        if (dummyOrg) {
            await queryRunner.query(`DELETE FROM "users" WHERE id = "?"`, [this.orgId]);
        }
        const dummyUser = await queryRunner.query(`SELECT * FROM "users" WHERE id = "?"`, [this.userId]);
        if (dummyUser) {
            await queryRunner.query(`DELETE FROM "users" WHERE id = "?"`, [this.userId]);
        }
    }
}
