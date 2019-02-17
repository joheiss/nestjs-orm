import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserBookmarkDTO } from './user-bookmark.dto';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user_bookmarks')
export class UserBookmarkEntity {
    @PrimaryColumn()
    id: string;
    @PrimaryColumn()
    type: string;
    @PrimaryColumn()
    objectId: string;
    @Column({ readonly: true, default: 'user-bookmarks' })
    objectType: string;
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => UserProfileEntity, profile => profile.id)
    @JoinTable()
    profile: string;

    toDTO(): UserBookmarkDTO  {
        const { createdAt, ...dto} = this;
        return {...dto } as UserBookmarkDTO;
    }
}
