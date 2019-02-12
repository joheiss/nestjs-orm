import { Entity, PrimaryColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('receivers')
export class ReceiverEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    id: number;
    @Column({ readonly: true, default: 'receivers' })
    objectType: string;
    @Index()
    @Column()
    organization: string;
    @Column({ default: true })
    isDeletable: boolean;
    @Column({ type: 'int', default: 0 })
    status: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    nameAdd: string;
    @Column({ length: 3 })
    country: string;
    @Column({ length: 10, nullable: true })
    postalCode: string;
    @Column({ nullable: true })
    city: string;
    @Column({ nullable: true })
    street: string;
    @Column({ nullable: true })
    email: string;
    @Column({ nullable: true })
    phone: string;
    @Column({ nullable: true })
    fax: string;
    @Column({ nullable: true })
    webSite: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    changedAt: Date;
}
