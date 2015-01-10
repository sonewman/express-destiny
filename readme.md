# Express-Destiny

Install:
```
npm install express-destiny
```

Express-Destiny is a simple express middleware, which allows middleware to be applied
depending on different Accept header formats (exactly like res.format() just a little 
more convenient)

e.g.

```javascript
var express = require('express')
var destiny = require('express-destiny')

var app = express()

app.use(destiny('json', function (req, res, next) {
  // do something if req.headers.Accept is a json format
}))

// alternatively you can add multiple

app.use(destiny({
  json: function (req, res, next) {
    // do something and return JSON
  },

  html: function () {
    // do something else and return HTML
  }
}))

// you can also parse an options object as the 2nd or 3rd argument...

destiny('json', function () {}, { defaultHTML: false })

// or

destiny({ json: function () {} }, { defaultHTML: false })

```

One thing it is worth noting, because older IE browsers send `Accept: */*` header when requesting 
html if you only specify JSON, this would cause for a request for HTML to return the JSON file 
attempting to download it to the user.

To deal with this issue we first ensure that the following mime-types are prioritised in the
following order:

- text
- text/plain
- html
- text/html
- default

If none of these mime-types are present then we set a `html` handle as the first format handle,
which calls `next()`.

If you would like to disable this you can do so by using `defaultHTML: false` option displayed in
the example above.

