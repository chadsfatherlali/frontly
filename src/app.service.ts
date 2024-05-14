import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class AppService {
  getPage(): string {
    const source: string = `<!DOCTYPE html>
    <html>
    <head>
        <title>Document</title>
    </head>
    <body>
      <pre>Hola {{ name }}</pre>
    </body>
    </html>`;

    const template: any = Handlebars.compile(source);
    const data: any = { name: 'Santiago Sánchez' };
    const result: any = template(data);

    return result;
  }
}
