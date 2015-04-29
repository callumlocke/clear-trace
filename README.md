# clear-trace

> For clearer stack traces in io.js/Node.

## Usage

```sh
$ npm install clear-trace
```

### Manual use on individual errors

```js
var clearTrace = require('clear-trace');

var err = new Error('oops');

console.log( clearTrace(err) ); // logs a readable stack trace
```
