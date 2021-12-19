<div align="center">
  <h1>rlr</h1>
  <p><b>rlr</b> (<b>R</b>ead<b>L</b>ine<b>R</b>everse) is an event-driven utility module for reading files in reverse, one line at a time.</p>
</div>

<div align="center">
  <a href="/LICENSE">
    <img alt="License GPLv3" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/rlr">
    <img alt="NPM" src="https://img.shields.io/npm/v/rlr?label=npm">
  </a>
  <a href="https://github.com/chronoDave/rlr/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/chronoDave/rlr/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/chronoDave/rlr/actions/workflows/codeql.yml">
    <img alt="CodeQL" src="https://github.com/chronoDave/rlr/actions/workflows/codeql.yml/badge.svg">
  </a>
</div>

## Features

- Zero depedency
- Event-driven
- Full Typescript support
- Supports both ES5 and ES6

## Install

```
$ npm i rlr
```

<i>Note: This package requires Node >= 14.14.0</i>

## Getting Started

```TS
import path from 'path';

import Rlr from 'rlr'; // ES6
// const Rlr = require('rlr').default // ES5

const rlr = new Rlr();
const stream = rlr.createInterface(path.resolve('./large-file.txt'))

stream
  .on('line', line => console.log(line))
  .on('close', () => console.log('end'))
  .on('error', err => console.error(err))
  
// Promise wrapper
const readFileReverse(
  file: PathLike,
  cb: ((line: string) => void)
) => new Promise<void>((resolve, reject) => new Rlr()
  .createInterface(file)
  .on('line', cb)
  .on('close', resolve)
  .on('error', reject));
  
readFileReverse('./large-file.txt', console.log);
```

## Options

- `size (default: 65536) (64kb)` Max buffer size in bytes
- `encoding (default: 'utf-8')` File encoding
- `newline (default: '\n')` Newline character
- `normalize (default: true)` If true, normalize `\r\n` to `\n`. Accepts RegExp, but does not append `\g` flag by default. Example: `/,/g`


## Donating

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y41E23T)
