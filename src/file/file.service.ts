import { Injectable } from '@nestjs/common';
import { PathLike } from 'fs';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(path: PathLike, file: Buffer) {
    return writeFile(path, file);
  }
  async download(path: PathLike) {
    return readFile(path);
  }
}
