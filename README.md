# supermarked

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/supermarked.svg)](https://greenkeeper.io/)

Marked with useful extensions:

 - Syntax highlighting (via CodeMirror)
 - LaTeX for maths (via KaTeX)
 - Mentions (just like in a GitHub issue)

[![Build Status](https://img.shields.io/travis/ForbesLindesay/supermarked/master.svg)](https://travis-ci.org/ForbesLindesay/supermarked)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/supermarked.svg)](https://david-dm.org/ForbesLindesay/supermarked)
[![NPM version](https://img.shields.io/npm/v/supermarked.svg)](https://www.npmjs.org/package/supermarked)

## API

```javascript
var marked = require('supermarked');
marked('markdown string', options);
```

## Extensions currently supported

### Syntax highlighting

Syntax highlighting using CodeMirror is enabled by default for code samples (requires css to actually have an impact).  You can control the CodeMirror theme using the `theme` option, and should include the appropriate CSS for your chosen theme.  e.g.

```
<link rel="stylesheet" href="https://codemirror.net/lib/codemirror.css">
```

[example](examples/code.md)

To disable syntax highlighting pass `{highlight: false}` for the options, or to use custom highlighting pass a function for the `highlight` option.

### KaTeX

You can write maths using LaTeX syntax, which will be compiled to HTML using KaTeX.  You must start maths expressions with a backtick followed by a dollar sign, and end it with a dollar sign followed by a backtick.  You can use two dollar signs for "Display Style" math (i.e. `display: block`).  For this to work, you must also add the KaTeX stylesheet to your page, and ensure that it is in UTF8

```
<meta charset="utf8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.css">
```

[example](examples/math.md)

To disable KaTeX pass `{math: false}` for the options.

### Mentions

You can use `service: @user` anywhere to mention someone and it will turn into a social link.  Supported services are `twitter`, `github`, `npm`, and `facebook`.  All of them are case sensetive and the space between `:` and `@` is optional.

In addition you can specify an `'@'` service that will then be used for mentions where no service was specified.  You can supply a custom service like:

```js
var html = marked(src, {
  services: {
    // by default, see if they are mentioning me and if they are, link to my blog
    '@': function (user) {
      return user === 'ForbesLindesay' ? 'http://www.forbeslindesay.co.uk' : null;
    },
    // provide an "example" service
    'example': 'http://www.example.com/user/:user:',
    // don't let people use the facebook service
    'facebook': false
  }
});
```

[example](examples/mentions.md)

To disable mentions pass `{mentions: false}` for the options.

## License

MIT
