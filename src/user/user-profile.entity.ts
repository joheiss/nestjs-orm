import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserProfileDTO } from './user-profile.dto';
import { UserSettingEntity } from './user-setting.entity';
import { UserBookmarkEntity } from './user-bookmark.entity';

@Entity('user_profiles')
export class UserProfileEntity {
    @PrimaryColumn()
    id: string;
    @Column({ readonly: true, default: 'user-profiles' })
    objectType: string;
    @Column({nullable: true})
    displayName: string;
    @Column({nullable: true})
    email: string;
    @Column({nullable: true})
    phone: string;
    @Column({nullable: true})
    imageUrl: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;

    @OneToMany(() => UserSettingEntity, setting => setting.id, { cascade: true })
    @JoinTable()
    settings: UserSettingEntity[];

    @OneToMany(() => UserBookmarkEntity, bookmark => bookmark.id, { cascade: true })
    @JoinTable()
    bookmarks: UserBookmarkEntity[];

    toDTO(): UserProfileDTO  {
        const { createdAt, changedAt, ...dto} = this;
        return {...dto } as UserProfileDTO;
    }
}
