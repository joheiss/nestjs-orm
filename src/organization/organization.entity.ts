import { Column, CreateDateColumn, Entity, PrimaryColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from 'typeorm';
import { OrganizationDTO } from './organization.dto';

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

    toDTO(withTree = false): OrganizationDTO {
        const { isDeletable, createdAt, changedAt, parent, children, ...dto} = this;
        let tree: OrganizationDTO[];
        if (withTree && children && children.length > 0) {
            tree = children.map(c => c.toDTO(withTree));
            return { ...dto, children: tree } as OrganizationDTO;
        }
        return { ...dto } as OrganizationDTO;
    }
}
