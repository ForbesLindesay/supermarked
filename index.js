'use strict';

var marked = require('marked');
var highlight = require('highlight-codemirror');
var katex = require('katex');
var entities = require("entities");

var defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  silent: false,
  highlight: null,
  langPrefix: 'cm-s-default lang-',
  smartypants: false,
  headerPrefix: '',
  xhtml: false
};

function renderMathsExpression(expr) {
  if (expr[0] === '$' && expr[expr.length - 1] === '$') {
    var displayStyle = false;
    expr = expr.substr(1, expr.length - 2);
    if (expr[0] === '$' && expr[expr.length - 1] === '$') {
      displayStyle = true;
      expr = '\\displaystyle ' + expr.substr(1, expr.length - 2);
    }
    var html = katex.renderToString(entities.decodeHTML(expr), displayStyle);
    return html;
  } else {
    return null;
  }
}

function renderHref(user, service) {
  if (service && typeof service === 'string' && service.indexOf(':user:') !== -1) {
    return service.replace(':user:', user);
  } else if (service && typeof service === 'function') {
    return service(user);
  }
}

module.exports = supermarked;
function supermarked(src, options) {
  options = options || {};
  if (options.theme && !options.langPrefix) {
    options.langPrefix = 'cm-s-' + options.theme + ' lang-';
  }
  Object.keys(defaults).forEach(function (key) {
    if (options[key] === undefined) {
      options[key] = defaults[key];
    }
  });

  var aliases = options.aliases || supermarked.aliases;
  if (options.highlight !== false && typeof options.highlight !== 'function') {
    options.highlight = function (code, lang) {
      if (lang) {
        try {
          var mode = aliases[lang.toLowerCase()] || lang.toLowerCase();
          highlight.loadMode(mode);
          return highlight(code, mode);
        } catch (ex) {
          throw ex;
        } //let marked automatically escape code in a language we don't speak
      }
    };
  }

  if (options.math !== false) {
    options.renderer = new marked.Renderer();
    var originalCode = options.renderer.code.bind(options.renderer);
    options.renderer.code = function(code, lang, escaped) {
      var math;
      if (!lang && (math = renderMathsExpression(code))) {
        return math;
      }
      return originalCode(code, lang, escaped);
    };
    var originalCodeSpan = options.renderer.codespan.bind(options.renderer);
    options.renderer.codespan = function(text) {
      var math;
      if (math = renderMathsExpression(text)) {
        return math;
      }
      return originalCodeSpan(text);
    };
  }

  var result = marked(src, options);

  if (options.mentions !== false) {
    var services = options.services || {};
    Object.keys(supermarked.services).forEach(function (key) {
      if (services[key] === undefined) {
        services[key] = supermarked.services[key];
      }
    });
    result = result.replace(/([a-z]+): *@([A-Za-z0-9_-]+)/g, function (_, service, user) {
        service = service.toLowerCase();
        var href;
        if (href = renderHref(user, services[service])) {
          return '<a href="'
           + href
           + '" class="user-profile user-profile-'
           + service
           + '">@'
           + user
           + '</a>';
        } else {
          return _;
        }
      })
      .replace(/@([A-Za-z0-9_-]+)(.*)/g, function (_, user, after) {
        var href;
        if (!/^\<\/a\>/.test(after) && (href = renderHref(user, services['@']))) {
          return '<a href="'
           + href
           + '" class="user-profile">@'
           + user
           + '</a>';
        } else {
          return _;
        }
      });;
  }

  return result;
}

var services = supermarked.services = {
  'twitter': 'https://twitter.com/:user:',
  'github': 'https://github.com/:user:',
  'npm': 'https://www.npmjs.org/~:user:',
  'facebook': 'https://www.facebook.com/:user:'
};

var alises = supermarked.aliases = {
  'js': 'javascript'
};
