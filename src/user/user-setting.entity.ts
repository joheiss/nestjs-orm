import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserSettingDTO } from './user-setting.dto';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user_settings')
export class UserSettingEntity {
    @PrimaryColumn()
    id: string;
    @PrimaryColumn( { default: 'default' })
    type: string;
    @Column({ readonly: true, default: 'user-settings' })
    objectType: string;
    @Column('int', { default: 10 })
    listLimit: number;
    @Column('int', {default: 90 })
    bookmarkExpiration: number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;

    @ManyToOne(() => UserProfileEntity, profile => profile.id)
    @JoinTable()
    profile: string;

    toDTO(): UserSettingDTO  {
        const { createdAt, changedAt, ...dto} = this;
        return {...dto } as UserSettingDTO;
    }
}
