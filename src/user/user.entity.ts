import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserDTO } from './user.dto';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Index({unique: true })
    @Column( {unique: true})
    username: string;
    @Column()
    password: string;
    @Column({ readonly: true, default: 'users' })
    objectType: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toDTO(withToken = false): UserDTO  {
        const { id, username, objectType, token } = this;
        if (withToken) {
            return { id, username, objectType, token } as UserDTO;
        }
        return { id, username, objectType } as UserDTO;
    }

    async isPasswordValid(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

   private get token() {
        const { id, username } = this;
        const secret = process.env.SECRET || '';
        return jwt.sign({ id, username }, secret, { expiresIn: '1d' });
    }
}
