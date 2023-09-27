import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashPipe implements PipeTransform {
  constructor(private readonly filter: string) {}
  async transform(data) {
    if (data[this.filter]) {
      const salt = await bcrypt.genSalt();
      data[this.filter] = await bcrypt.hash(data[this.filter], salt);
    }
    return data;
  }
}
