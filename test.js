'use strict';

var fs = require('fs');
var marked = require('./');

var PREFIX = '<!DOCTYPE html><html><head><meta charset="utf8">' +
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.css">' +
    '<link rel="stylesheet" href="https://codemirror.net/lib/codemirror.css">' +
    '</head><body>';
var SUFIX = '</body></html>';

fs.readdirSync(__dirname + '/examples').forEach(function (example) {
  example = __dirname + '/examples/' + example;
  if (/\.md$/.test(example)) {
    fs.writeFileSync(example.replace(/\.md$/, '.html'), PREFIX + marked(fs.readFileSync(example, 'utf8'), {
      services: {
        '@': function (user) {
          return user === 'ForbesLindesay' ? 'http://www.forbeslindesay.co.uk' : null;
        }
      }
    }) + SUFIX);
  }
});
