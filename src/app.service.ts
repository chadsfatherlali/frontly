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
      <p>Hola {{name}}</p>
      {{> button}}
    </body>
    </html>`;

    Handlebars.registerPartial(
      'button',
      `<button id="alertMessage">Click me!</button>
      <script>
        document.querySelector('#alertMessage').onclick = () => {
          alert('Hola {{name}}')
        }
      </script>`,
    );

    const template: any = Handlebars.compile(source);
    const data: any = { name: 'Santiago Sánchez' };
    const result: any = template(data);

    return result;
  }
}
