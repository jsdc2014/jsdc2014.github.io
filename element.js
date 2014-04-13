'use strict';

;(function (window, Element) {
  'use strict';

  // defineGetter
  var defineGetter = function (obj, key, fn) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, key, {
        get: fn,
        configurable: true
      });
      return true;
    } else if (obj.__defineGetter__) {
      obj.__defineGetter__(key, fn);
      return true;
    }
    return false;
  };

  // classList
  (function () {
    if ('classList' in document.documentElement) {
      return;
    }

    window.DOMTokenList = DOMTokenList;

    function DOMTokenList(el) {
      var classArray = [];
      var list = this;

      this.__element = el;
      this.__class = classArray;

      defineGetter(this, 'length', function () {
        return list.__length;
      });

      syncElementClassList(this);
    }

    var array = Array.prototype;
    
    DOMTokenList.prototype = {
      indexOf: array.indexOf,
      slice: array.slice,
      push: array.push,
      splice: array.splice,
      join: array.join
    };

    DOMTokenList.prototype.add = function () {
      var tokens = arguments;
      var tlen = tokens.length;
      var map = this.__map;
      var el = this.__element;
      var cls;

      syncElementClassList(this);

      while (tlen--) {
        cls = tokens[tlen].replace(/(^\s+|\s+$)/g, '');

        if (!cls) {
          throw new Error('Failed to execute \'add\' on \'DOMTokenList\': The token provided must not be empty.');
        }

        if (!map.hasOwnProperty(cls)) {
          this[this.__length] = cls;
          map[cls] = this.__length;
          this.__length += 1;
        }
      }

      el.setAttribute('class', Array.prototype.join.call(this, ' '));
    };

    DOMTokenList.prototype.contains = function (cls) {
      syncElementClassList(this);
      return this.__map.hasOwnProperty(cls);
    };

    DOMTokenList.prototype.item = function (index) {
      syncElementClassList(this);
      return this[index];
    };

    DOMTokenList.prototype.remove = function () {
      syncElementClassList(this);
      var tokens = arguments;
      var tlen = tokens.length;
      var map = this.__map;
      var index, token;

      while (tlen--) {
        token = tokens[tlen];
        if (map.hasOwnProperty(token)) {
          index = map[token];
          delete this[index];
          delete map[token];
          this.__length -= 1;
        }
      }

      this.__element.setAttribute('class', Array.prototype.join.call(this, ' '));
    };

    DOMTokenList.prototype.toggle = function (cls) {
      if (!cls) {
        throw new Error('Failed to execute \'toggle\' on \'DOMTokenList\': The token provided must not be empty.');
      }
      
      syncElementClassList(this);
      
      var map = this.__map;
      var el = this.__element;
      var ret;

      if (map.hasOwnProperty(cls)) {
        delete this[map[cls]];
        delete map[cls];
        ret = false;
      } else {
        this[this.__length] = cls;
        this.__map[cls] = this.__length;
        this.__length += 1;
        ret = true;
      }

      el.setAttribute('class', Array.prototype.join.call(this, ' '));

      return ret;
    };

    DOMTokenList.prototype.toString = function () {
      syncElementClassList(this);
      return Array.prototype.join.call(this, ' ');
    };

    function syncElementClassList(list) {
      var el = list.__element;
      var classAttr = el.getAttribute('class');
      
      if (classAttr === list.__cache) {
        return;
      }
      
      var classList = classAttr ? classAttr.split(/\s+/) : [];
      var len = classList.length;
      var val, map = {};

      list.__cache = classAttr;
      list.__map = map;
      list.__length = len;

      while (len--) {
        val = classList[len];
        list[len] = val;
        map[val] = len;
      }
    }

    defineGetter(Element.prototype, 'classList', function () {
      return this.__classList || (this.__classList = new DOMTokenList(this));
    });
  })();

})(this, Element);
