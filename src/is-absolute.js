/**
 * Lifted from https://github.com/iojs/io.js/blob/master/lib/path.js
 */

const isAbsolute = process.platform === 'win32' ?

  function isAbsoluteWindows(filename) {
    const result = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(filename);
    const device = result[1] || '';
    const isUnc = !!device && device.charAt(1) !== ':';

    return !!result[2] || isUnc;
  } :

  function isAbsolutePosix(filename) {
    return filename.charAt(0) === '/';
  }
;

export default isAbsolute;
