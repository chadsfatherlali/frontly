import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../sites/sites.schema';
import { Page } from '../pages/page.schema';
import { Template } from '../templates/templates.schema';
import { Snippet } from '../snippets/snippet.schema';
import { Widget } from '../widgets/widgets.schema';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Index('user_email_idx')
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Site, (site) => site.user)
  sites: Site[];

  @OneToMany(() => Page, (page) => page.user)
  pages: Page[];

  @OneToMany(() => Template, (template) => template.user)
  templates: Template[];

  @OneToMany(() => Snippet, (snippet) => snippet.user)
  snippets: Snippet[];

  @OneToMany(() => Widget, (widget) => widget.user)
  widgets: Snippet[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);
  }
}
