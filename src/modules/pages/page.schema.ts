import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../sites/sites.schema';
import { User } from '../users/users.schema';
import { Template } from '../templates/templates.schema';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('page_url_idx')
  @Column({ unique: true })
  url: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  templateId: string;

  @Column({ default: false })
  private: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.pages)
  user: User;

  @ManyToOne(() => Site, (site) => site.pages)
  site: Site;

  @ManyToOne(() => Template, (template) => template.pages)
  template: Template;
}
