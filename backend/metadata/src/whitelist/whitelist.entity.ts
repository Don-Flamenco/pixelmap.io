import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class WhitelistData {
  @PrimaryColumn('int')
  id: number;

  @Column('text', { nullable: true })
  address: string;
}
