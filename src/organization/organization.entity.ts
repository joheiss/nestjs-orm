import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn, Tree, TreeChildren, TreeParent,
    UpdateDateColumn,
} from 'typeorm';

@Entity('organizations')
@Tree('materialized-path')
export class OrganizationEntity {
    @PrimaryColumn({ unique: true })
    id: string;
    @Column({ readonly: true, default: 'organizations' })
    objectType: string;
    @Column({ default: true })
    isDeletable: boolean;
    @Column({ type: 'int', default: 0 })
    status: number;
    @Column()
    name: string;
    @Column({ nullable: true})
    timezone: string;
    @Column({ nullable: true})
    currency: string;
    @Column({ nullable: true})
    locale: string;
    @TreeChildren()
    children: OrganizationEntity[];
    @TreeParent()
    parent: OrganizationEntity;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;
}
