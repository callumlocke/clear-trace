import isString from 'lodash.isstring';
import stackTrace from 'stack-trace';
import isAbsolute from 'is-absolute';
import {join, relative} from 'path';
import {red, gray} from 'chalk';
import subdir from 'subdir';


export default function (err, options) {
  if (!err || !err.stack) {
    return 'Not an error: ' + err;
  }

  if (!options) options = {};
  if (!isString(options.cwd)) options.cwd = process.cwd();

  return '\n' + red(err.message) + '\n' + stackTrace.parse(err).map(call => {
    if (isString(call.fileName)) {
      const absolute = isAbsolute(call.fileName);

      if (
        absolute &&
        subdir(options.cwd, call.fileName) &&
        !subdir(join(options.cwd, 'node_modules'), call.fileName)) {

        // absolute and within CWD (but not in node_modules folder)
        // - highlight this line
        return (
          (call.functionName ? gray('  at ') + call.functionName : ' ') +
          gray(' in ') + join('./', relative(options.cwd, call.fileName)) +
          (call.lineNumber ? gray(':' + call.lineNumber + ':' + call.columnNumber) : '')
        );
      }
      else {

        // anywhere else - dim this line
        return gray(
          (call.functionName ? '  at ' + call.functionName : ' ') +
          ' in ' + relative(options.cwd, call.fileName) +
          (call.lineNumber ? ':' + call.lineNumber + ':' + call.columnNumber : '')
        );
      }
    }

    // no filename - dim this line
    return gray(
      (call.functionName ? '  at ' + call.functionName : ' ') +
      ' in [unknown]'
    );
  }).join('\n');
}
