'use strict';

import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import subdir from 'subdir';
import stackTrace from 'stack-trace';

export default function (err, options) {
  if (!err || !err.stack) {
    return 'Not an error! ' + err;
  }

  if (!options) options = {};
  if (!_.isString(options.cwd)) options.cwd = process.cwd();

  let doneOneBright;

  return '\n' + chalk.red(err.message) + '\n' + stackTrace.parse(err).map(call => {
    if (_.isString(call.fileName)) {
      let colour, filename;

      const isAbsolute = call.fileName.charAt(0) === '/';

      if (
        isAbsolute &&
        subdir(options.cwd, call.fileName) &&
        !subdir(path.join(options.cwd, 'node_modules'), call.fileName)) {
        colour = (doneOneBright ? chalk.white : chalk.yellow);
        doneOneBright = true;
      }
      else {
        colour = chalk.gray;
      }

      filename = isAbsolute ?
        path.join('./', path.relative(options.cwd, call.fileName)):
        call.fileName;


      return (
        '  ' + colour(filename) +
        chalk.gray(':' + call.lineNumber + ':' + call.columnNumber) +
        chalk.gray(' in ') + colour(call.functionName)
      );
    }

    return chalk.yellow('[unknown]');
  }).join('\n');
}
