const path = require('path');
const os = require('os');

const test = require('tape');

const Rlr = require('..');

test('[createInterface] should read file in reverse', t => {
  const n = 16;
  const rlr = new Rlr();
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => {
      t.fail(err);
      t.end();
    })
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      const invalidIndex = lines.findIndex((line, i) => line !== `${n - (i + 1)}`);
      if (invalidIndex !== -1) t.fail(`Value mismatch: ${n - (invalidIndex + 1)}:${lines[invalidIndex]}`);
      t.end();
    });
});

test('[createInterface] should read large file', t => {
  const n = 65536;
  const rlr = new Rlr({ newline: '\n' });
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => {
      t.fail(err);
      t.end();
    })
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      const invalidIndex = lines.findIndex((line, i) => line !== `${n - (i + 1)}`);
      if (invalidIndex !== -1) t.fail(`Value mismatch: ${n - (invalidIndex + 1)}:${lines[invalidIndex]}`);
      t.end();
    });
});

test('[createInterface] should accept size option', t => {
  const n = 16;
  const rlr = new Rlr({ size: 1024 });
  const stream = rlr.createInterface(path.resolve(__dirname, `./data/${n}.txt`));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => {
      t.fail(err);
      t.end();
    })
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
    .on('error', err => {
      t.fail(err);
      t.end();
    })
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      t.end();
    });
});

test('[createInterface] should accept newline option', t => {
  const n = 16;
  const rlr = new Rlr({ newline: os.EOL });
  const stream = rlr.createInterface(path.resolve(__dirname, './data/16.txt'));
  const lines = [];

  stream
    .on('line', line => lines.push(line))
    .on('error', err => {
      t.fail(err);
      t.end();
    })
    .on('close', () => {
      t.equal(lines.length, n, 'does not skip');
      t.end();
    });
});

test('[createInterface] throws error if invalid newline option is used', t => {
  const rlr = new Rlr({ newline: 'newline' });
  const stream = rlr.createInterface(path.resolve(__dirname, './data/65536.txt'));

  stream
    .on('error', err => {
      t.pass(err);
      t.end();
    })
    .on('close', () => {
      t.fail('Expected to throw');
      t.end();
    });
});

test('[createInterface] throws error if buffer is too small', t => {
  const rlr = new Rlr({ size: 1 });
  const stream = rlr.createInterface(path.resolve(__dirname, './data/16.txt'));

  stream
    .on('error', err => {
      t.pass(err);
      t.end();
    })
    .on('close', () => {
      t.fail('Expected to throw');
      t.end();
    });
});
