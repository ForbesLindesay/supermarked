# supermarked

  Marked with syntax highlighting and ascii-math by default

## API

```javascript
var marked = require('supermarked');
marked('markdown string', options);
```

## Extensions currently supported

### Syntax highlighting

  Syntax highlighting using highlight.js is enabled by default for code samples (requires css to actually have an impact)

### ascii-math

  You can create math in two ways, it can go inline in a paragraph like $e^(i pi)=-1$ or it can be a block

    $e^(i pi)=-1$

  To have it like a block, simply indent it 4 spaces like code and surround with $ signs.

### Mentions

  You can use `service: @user` anywhere to mention someone and it will turn into a social link.  Supported services are `twitter`, `github`, `npm`, and `facebook`.  All of them are case sensetive and the space between `:` and `@` is optional.

  In addition to this there is `local: @user` which becomes a link to `/user/:user:` (where `:user:` is replaced with the username of the person being mentioned).  This is also aliased as the default if you just type `@user`