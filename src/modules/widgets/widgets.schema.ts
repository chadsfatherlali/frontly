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
import { Site } from '../sites/sites.schema';

@Entity()
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Index('widget_name_idx')
  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  root: string;

  @Column({ nullable: false })
  indexJs: string;

  @Column({ nullable: false })
  indexCss: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.widgets)
  user: User;

  @ManyToOne(() => Site, (site) => site.widgets)
  site: Site;
}
