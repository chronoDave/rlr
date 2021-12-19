const path = require('path');

const test = require('tape');

const Rlr = require('..');

test('[createInterface] should read file in reverse', t => {
  const n = 16;
  const rlr = new Rlr();
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => t.fail(err))
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      const invalidIndex = lines.findIndex((line, i) => line !== `${n - (i + 1)}`);
      if (invalidIndex !== -1) t.fail(`Value mismatch: ${n - (invalidIndex + 1)}:${lines[invalidIndex]}`);
      t.end();
    });
});

test('[createInterface] should read large file', t => {
  const n = 65536;
  const rlr = new Rlr();
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => t.fail(err))
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      const invalidIndex = lines.findIndex((line, i) => line !== `${n - (i + 1)}`);
      if (invalidIndex !== -1) t.fail(`Value mismatch: ${n - (invalidIndex + 1)}:${lines[invalidIndex]}`);
      t.end();
    });
});

test('[createInterface] should accept highWaterMark option', t => {
  const n = 16;
  const rlr = new Rlr({ highWaterMark: 4 });
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => t.fail(err))
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      t.end();
    });
});

test('[createInterface] should accept encoding option', t => {
  const n = 16;
  const rlr = new Rlr({ encoding: 'utf-16le' });
  const stream = rlr.createInterface(path.resolve(__dirname, './data/utf-16le.txt'));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => t.fail(err))
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      t.end();
    });
});

test('[createInterface] should accept newline option', t => {
  const n = 16;
  const rlr = new Rlr({ newline: '\r\n', normalize: /\n/g });
  const stream = rlr.createInterface(path.resolve(__dirname, './data/16.txt'));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => t.fail(err))
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      t.end();
    });
});
