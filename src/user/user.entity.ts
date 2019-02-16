import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserDTO } from './user.dto';
import { UserProfileEntity } from './user-profile.entity';

@Entity('users')
export class UserEntity {
    @PrimaryColumn( {unique: true })
    id: string;
    @Column()
    password: string;
    @Column({ readonly: true, default: 'users' })
    objectType: string;
    @Index({ unique: false})
    @Column()
    organization: string;
    @Column({ nullable: true })
    roles: string;
    @Column({ default: false })
    locked: boolean;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;

    @OneToOne(() => UserProfileEntity, { cascade: true, nullable: true, })
    @JoinColumn()
    profile: UserProfileEntity;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toDTO(): UserDTO  {
        const { password, createdAt, changedAt, roles, profile, ...dto} = this;
        const rolesArray = roles.split(',').map(r => r.trim());
        return {...dto, roles: rolesArray } as UserDTO;
    }
}
