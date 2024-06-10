import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.schema';

@Entity()
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('site_slug_idx')
  @Column({ unique: true })
  siteSlug: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.sites)
  user: User;
}
