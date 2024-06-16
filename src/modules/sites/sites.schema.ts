import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.schema';
import { Page } from '../pages/page.schema';
import { Template } from '../templates/templates.schema';
import { Snippet } from '../snippets/snippet.schema';
import { Widget } from '../widgets/widgets.schema';

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

  @OneToMany(() => Page, (page) => page.site)
  pages: Page[];

  @OneToMany(() => Template, (template) => template.site)
  templates: Template[];

  @OneToMany(() => Snippet, (snippet) => snippet.site)
  snippets: Snippet[];

  @OneToMany(() => Widget, (widget) => widget.site)
  widgets: Snippet[];
}
