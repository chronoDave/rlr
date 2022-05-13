import fs from 'fs';
import { promisify } from 'util';
import { EventEmitter } from 'stream';
import os from 'os';

export type ReadlineReverseOptions = {
  size?: ReadlineReverse['_size']
  encoding?: ReadlineReverse['_encoding']
  newline?: ReadlineReverse['_newline']
};

export type ReadlineReverseEvents = {
  line: string
  close: void
  error: Error
};

export type ReadlineReverseEmitter<T> = {
  on: <K extends keyof T>(
    event: K,
    listener: (value: T[K]) => void
  ) => ReadlineReverseEmitter<ReadlineReverseEvents>
  emit: <K extends keyof T>(event: K, value?: T[K]) => void
};

export default class ReadlineReverse {
  private _size: number;
  private _encoding: BufferEncoding;
  private _emitter: ReadlineReverseEmitter<ReadlineReverseEvents>;
  private _newline: string;

  private _stat = promisify(fs.stat);
  private _open = promisify(fs.open);
  private _read = promisify(fs.read);
  private _close = promisify(fs.close);

  private _readLine(fd: number, size: number, position: number) {
    return this._read(fd, Buffer.alloc(size), 0, size, position)
      .then(({ buffer }) => {
        const raw = buffer.toString(this._encoding);
        const lines = raw.split(this._newline);

        /**
         * Always assume the last number is incorrect
         * and remove it from the list, unless
         * it's the last chunk
         */
        const remainder = position !== 0 ?
          Buffer.byteLength(lines.shift() || '', this._encoding) :
          0;

        for (let i = lines.length - 1; i >= 0; i -= 1) {
          this._emitter.emit('line', lines[i].trim());
        }

        return remainder;
      });
  }

  constructor(options?: ReadlineReverseOptions) {
    this._size = options?.size ?? 1024 * 64; // 64kb
    this._encoding = options?.encoding ?? 'utf-8';
    this._newline = options?.newline ?? os.EOL;

    this._emitter = new EventEmitter();
  }

  createInterface(path: fs.PathLike) {
    Promise.all([
      this._stat(path),
      this._open(path, 'r')
    ])
      .then(async ([stats, fd]) => {
        let stack = stats.size;

        while (stack > 0) {
          const size = Math.min(stack, this._size);
          const remainder = await this._readLine(fd, size, stack - size);

          if (size === remainder) {
            await this._close(fd);
            throw new Error('Line length bigger than buffer size. Make sure the newline character is valid or try increasing the buffer size.');
          }

          stack -= (size - remainder);
        }

        await this._close(fd);
        this._emitter.emit('close');
      })
      .catch(err => this._emitter.emit('error', err));

    return this._emitter;
  }
}
