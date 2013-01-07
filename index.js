var marked = require('marked');
var hljs = require('highlight.js');
var math = require('ascii-math');

var exports = module.exports = supermarked;
supermarked.parse = supermarked;
function supermarked(src, options) {
  options = options || {};
  options.gfm = options.gfm !== false;
  var aliases = options.aliases || exports.aliases;
  options.highlight = options.highlight || function (code, lang) {
    if (lang) {
      try {
        return hljs.highlight(aliases[lang.toLowerCase()] || lang.toLowerCase(), code).value;
      } catch (ex) {} //let marked automatically escape code in a language we don't speak
    } else {
      try {
        if (!options.ignoreMath && /^\$.+\$$/.test(code))
          var res = math(code.substring(1, code.length - 1))
          res.setAttribute('style', 'display: block;')
          return res.toString();
      } catch (ex) {}
    }
  }
  var tokens = marked.lexer(src, options);
  var result = marked.parser(tokens, options)
  if (!options.ignoreMentions) {
    var services = options.services || exports.services;
    result = result.replace(/([^ ]+): *@([A-Za-z0-9_-]+)/, function (_, service, user) {
        service = service.toLowerCase();
        if (services[service]) {
          return '<a href="'
           + services[service].replace(':user:', user)
           + '" class="user-profile user-profile-'
           + service 
           + '">@' 
           + user 
           + '</a>';
        } else {
          return _;
        }
      })
      .replace(/ @([A-Za-z0-9_-]+)/, function (_, user) {
        if (services['@']) {
          return ' <a href="'
           + services['@'].replace(':user:', user)
           + '" class="user-profile">@' 
           + user 
           + '</a>';
        } else {
          return _;
        }
      });;
  }
  if (!options.ignoreMath) {
    result = result.replace(/<pre><code><math/g, '<math').replace(/<\/math><\/code><\/pre>/g, '</math>').replace(/\\\$/g, '__DOLLAR_SIGN__').split('$');
    for (var i = 1; i < result.length; i += 2) {
      result[i] = math(result[i].trim().replace(/__DOLLAR_SIGN__/g, '$').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<')).toString();
    }
    result = result.join('').replace(/__DOLLAR_SIGN__/g, '$');
  }
  return result;
}

var services = exports.services = {
  'twitter': 'https://twitter.com/:user:',
  'github': 'https://github.com/:user:',
  'npm': 'https://npmjs.org/~:user:',
  'facebook': 'https://www.facebook.com/:user:',
  'local': '/user/:user:'
};
services['@'] = services.local;//set the default here

var alises = exports.aliases = {
  'js': 'javascript'
};