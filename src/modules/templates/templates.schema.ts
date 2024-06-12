import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../sites/sites.schema';
import { User } from '../users/users.schema';
import { Page } from '../pages/page.schema';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  template: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.pages)
  user: User;

  @ManyToOne(() => Site, (site) => site.pages)
  site: Site;

  @OneToMany(() => Page, (page) => page.template)
  pages: Page[];
}
