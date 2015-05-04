'use strict';

import isString from 'lodash/lang/isString';
import path from 'path';
import chalk from 'chalk';
import subdir from 'subdir';
import stackTrace from 'stack-trace';
import isAbsolute from './is-absolute';


export default function (err, options) {
  if (!err || !err.stack) {
    return 'Not an error: ' + err;
  }

  if (!options) options = {};
  if (!isString(options.cwd)) options.cwd = process.cwd();

  return '\n' + chalk.red(err.message) + '\n' + stackTrace.parse(err).map(call => {
    if (isString(call.fileName)) {
      const absolute = isAbsolute(call.fileName);

      if (
        absolute &&
        subdir(options.cwd, call.fileName) &&
        !subdir(path.join(options.cwd, 'node_modules'), call.fileName)) {

        return (
          (call.functionName ? chalk.gray('  at ') + call.functionName : ' ') +
          chalk.gray(' in ') + path.join('./', path.relative(options.cwd, call.fileName)) +
          (call.lineNumber ? chalk.gray(':' + call.lineNumber + ':' + call.columnNumber) : '')
        );
      }
      else {
        return chalk.gray(
          (call.functionName ? '  at ' + call.functionName : ' ') +
          ' in ' + path.relative(options.cwd, call.fileName) +
          (call.lineNumber ? ':' + call.lineNumber + ':' + call.columnNumber : '')
        );
      }
    }

    return chalk.gray(
      (call.functionName ? '  at ' + call.functionName : ' ') +
      ' in [unknown]'
    );
  }).join('\n');
}
