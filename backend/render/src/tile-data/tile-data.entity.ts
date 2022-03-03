import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class TileData {
    @PrimaryColumn('int')
    id: number;

    @Column('text', { nullable: true })
    name: string;

    @Column('text', { nullable: true })
    image_data: string;

    @Column('text', { nullable: true })
    image_data_live: string;

    @Column('text', { nullable: true })
    url: string;

    @Column('int', { nullable: true })
    price: number;

    @Column('int', { nullable: true })
    lastUpdate: number;

    @Column('text', { nullable: true })
    owner: string;

    @Column('text', { nullable: true })
    approved: string;
}
