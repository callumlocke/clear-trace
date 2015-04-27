# pretty-stack

> Function to get a more useful stack trace, with shorter paths and colour to highlight the most important files.

```js
var prettyStack = require('pretty-stack');

var err = new Error('oops');

var text = prettyStack(err);

console.log(text);
```
