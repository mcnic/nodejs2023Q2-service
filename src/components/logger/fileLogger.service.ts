import { Injectable } from '@nestjs/common';
import { LoggerParams, logLevels } from './logger.interface';
import { stat, unlink, writeFile } from 'fs/promises';
import { isObject } from 'class-validator';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream, existsSync } from 'fs';

@Injectable()
export class FileLoggerService {
  constructor(
    private readonly pathLogFile: string,
    private readonly pathErrorFile: string,
    private readonly sizeLimit: number,
  ) {}

  async rotateFile(fileName: string) {
    try {
      if (existsSync(fileName)) {
        const stats = await stat(this.pathLogFile);

        stats.isFile();

        if (stats.size > this.sizeLimit * 1024) {
          const arch = createGzip();
          const source = createReadStream(fileName);
          const date = new Date().toISOString();
          const destination = createWriteStream(`${fileName}_${date}.zip`);

          await pipeline(source, arch, destination);

          await unlink(fileName);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async log({ level, date, message }: LoggerParams, logOrError: boolean) {
    const filePath = logOrError ? this.pathLogFile : this.pathErrorFile;

    await this.rotateFile(filePath);

    const msg = isObject(message) ? JSON.stringify(message) : message;

    await writeFile(filePath, `[${date}]:${logLevels[level]} - ${msg}\n`, {
      flag: 'a',
    });
  }
}
