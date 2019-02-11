import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('receivers')
export class ReceiverEntity {
    @PrimaryColumn()
    id: string;
    @Column({ default: 'receivers' })
    objectType: string;
    @Column()
    organization: string;
    @Column({ default: true })
    isDeleteable: boolean;
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
    @Column()
    email: string;
    @Column({ nullable: true })
    phone: string;
    @Column({ nullable: true })
    fax: string;
    @Column({ nullable: true })
    webSite: string;
}
