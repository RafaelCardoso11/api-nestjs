import { Injectable } from '@nestjs/common';

let hello = 'Hello World!';
@Injectable()
export class AppService {
  getHello(): string {
    return hello;
  }
  setHello(newHello): string {
    hello = newHello;
    return hello;
  }
}
