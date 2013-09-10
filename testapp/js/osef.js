// Copyright 2012 Traceur Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * The traceur runtime.
 */
(function(global) {
  'use strict';

  var $create = Object.create;
  var $defineProperty = Object.defineProperty;
  var $freeze = Object.freeze;
  var $getOwnPropertyNames = Object.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;

  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }

  var method = nonEnum;

  function polyfillString(String) {
    // Harmony String Extras
    // http://wiki.ecmascript.org/doku.php?id=harmony:string_extras
    Object.defineProperties(String.prototype, {
      startsWith: method(function(s) {
       return this.lastIndexOf(s, 0) === 0;
      }),
      endsWith: method(function(s) {
        var t = String(s);
        var l = this.length - t.length;
        return l >= 0 && this.indexOf(t, l) === l;
      }),
      contains: method(function(s) {
        return this.indexOf(s) !== -1;
      }),
      toArray: method(function() {
        return this.split('');
      })
    });

    // 15.5.3.4 String.raw ( callSite, ...substitutions)
    $defineProperty(String, 'raw', {
      value: function(callsite) {
        var raw = callsite.raw;
        var len = raw.length >>> 0;  // ToUint
        if (len === 0)
          return '';
        var s = '';
        var i = 0;
        while (true) {
          s += raw[i];
          if (i + 1 === len)
            return s;
          s += arguments[++i];
        }
      },
      configurable: true,
      enumerable: false,
      writable: true
    });
  }

  var counter = 0;

  /**
   * Generates a new unique string.
   * @return {string}
   */
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }

  var nameRe = /^__\$(?:\d+)\$(?:\d+)\$__$/;

  var internalStringValueName = newUniqueString();

  /**
   * Creates a new private name object.
   * @param {string=} string Optional string used for toString.
   * @constructor
   */
  function Name(string) {
    if (!string)
      string = newUniqueString();
    $defineProperty(this, internalStringValueName, {value: newUniqueString()});

    function toString() {
      return string;
    }
    $freeze(toString);
    $freeze(toString.prototype);
    var toStringDescr = method(toString);
    $defineProperty(this, 'toString', toStringDescr);

    this.public = $freeze($create(null, {
      toString: method($freeze(function toString() {
        return string;
      }))
    }));
    $freeze(this.public.toString.prototype);

    $freeze(this);
  };
  $freeze(Name);
  $freeze(Name.prototype);

  function assertName(val) {
    if (!NameModule.isName(val))
      throw new TypeError(val + ' is not a Name');
    return val;
  }

  // Private name.

  // Collection getters and setters
  var elementDeleteName = new Name();
  var elementGetName = new Name();
  var elementSetName = new Name();

  // HACK: We should use runtime/modules/std/name.js or something like that.
  var NameModule = $freeze({
    Name: function(str) {
      return new Name(str);
    },
    isName: function(x) {
      return x instanceof Name;
    },
    elementGet: elementGetName,
    elementSet: elementSetName,
    elementDelete: elementDeleteName
  });

  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

  // Override getOwnPropertyNames to filter out private name keys.
  function getOwnPropertyNames(object) {
    return filter($getOwnPropertyNames(object), function(str) {
      return !nameRe.test(str);
    });
  }

  // Override Object.prototpe.hasOwnProperty to always return false for
  // private names.
  function hasOwnProperty(name) {
    if (NameModule.isName(name) || nameRe.test(name))
      return false;
    return $hasOwnProperty.call(this, name);
  }

  function elementDelete(object, name) {
    if (traceur.options.trapMemberLookup &&
        hasPrivateNameProperty(object, elementDeleteName)) {
      return getProperty(object, elementDeleteName).call(object, name);
    }
    return deleteProperty(object, name);
  }

  function elementGet(object, name) {
    if (traceur.options.trapMemberLookup &&
        hasPrivateNameProperty(object, elementGetName)) {
      return getProperty(object, elementGetName).call(object, name);
    }
    return getProperty(object, name);
  }

  function elementHas(object, name) {
    // Should we allow trapping this too?
    return has(object, name);
  }

  function elementSet(object, name, value) {
    if (traceur.options.trapMemberLookup &&
        hasPrivateNameProperty(object, elementSetName)) {
      getProperty(object, elementSetName).call(object, name, value);
    } else {
      setProperty(object, name, value);
    }
    return value;
  }

  function assertNotName(s) {
    if (nameRe.test(s))
      throw Error('Invalid access to private name');
  }

  function deleteProperty(object, name) {
    if (NameModule.isName(name))
      return delete object[name[internalStringValueName]];
    if (nameRe.test(name))
      return true;
    return delete object[name];
  }

  function getProperty(object, name) {
    if (NameModule.isName(name))
      return object[name[internalStringValueName]];
    if (nameRe.test(name))
      return undefined;
    return object[name];
  }

  function hasPrivateNameProperty(object, name) {
    return name[internalStringValueName] in Object(object);
  }

  function has(object, name) {
    if (NameModule.isName(name) || nameRe.test(name))
      return false;
    return name in Object(object);
  }

  // This is a bit simplistic.
  // http://wiki.ecmascript.org/doku.php?id=strawman:refactoring_put#object._get_set_property_built-ins
  function setProperty(object, name, value) {
    if (NameModule.isName(name)) {
      var descriptor = $getPropertyDescriptor(object,
                                              [name[internalStringValueName]]);
      if (descriptor)
        object[name[internalStringValueName]] = value;
      else
        $defineProperty(object, name[internalStringValueName], nonEnum(value));
    } else {
      assertNotName(name);
      object[name] = value;
    }
  }

  function defineProperty(object, name, descriptor) {
    if (NameModule.isName(name)) {
      // Private names should never be enumerable.
      if (descriptor.enumerable) {
        descriptor = Object.create(descriptor, {
          enumerable: {value: false}
        });
      }
      $defineProperty(object, name[internalStringValueName], descriptor);
    } else {
      assertNotName(name);
      $defineProperty(object, name, descriptor);
    }
  }

  function $getPropertyDescriptor(obj, name) {
    while (obj !== null) {
      var result = Object.getOwnPropertyDescriptor(obj, name);
      if (result)
        return result;
      obj = $getPrototypeOf(obj);
    }
    return undefined;
  }

  function getPropertyDescriptor(obj, name) {
    if (NameModule.isName(name))
      return undefined;
    assertNotName(name);
    return $getPropertyDescriptor(obj, name);
  }

  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'deleteProperty', method(deleteProperty));
    $defineProperty(Object, 'getOwnPropertyNames',
                    {value: getOwnPropertyNames});
    $defineProperty(Object, 'getProperty', method(getProperty));
    $defineProperty(Object, 'getPropertyDescriptor',
                    method(getPropertyDescriptor));
    $defineProperty(Object, 'has', method(has));
    $defineProperty(Object, 'setProperty', method(setProperty));
    $defineProperty(Object.prototype, 'hasOwnProperty',
                    {value: hasOwnProperty});

    // Object.is

    // Unlike === this returns true for (NaN, NaN) and false for (0, -0).
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }

    $defineProperty(Object, 'is', method(is));
  }

  // Iterators.
  var iteratorName = new Name('iterator');

  var IterModule = {
    get iterator() {
      return iteratorName;
    },
    // TODO: Implement the rest of @iter and move it to a different file that
    // gets compiled.
  };

  function getIterator(collection) {
    return getProperty(collection, iteratorName).call(collection);
  }

  function returnThis() {
    return this;
  }

  function addIterator(object) {
    // Generator instances are iterable.
    setProperty(object, iteratorName, returnThis);
    return object;
  }

  function polyfillArray(Array) {
    // Make arrays iterable.
    defineProperty(Array.prototype, IterModule.iterator, method(function() {
      var index = 0;
      var array = this;
      return {
        next: function() {
          if (index < array.length) {
            return {value: array[index++], done: false};
          }
          return {value: undefined, done: true};
        }
      };
    }));
  }

  /**
   * @param {Function} canceller
   * @constructor
   */
  function Deferred(canceller) {
    this.canceller_ = canceller;
    this.listeners_ = [];
  }

  function notify(self) {
    while (self.listeners_.length > 0) {
      var current = self.listeners_.shift();
      var currentResult = undefined;
      try {
        try {
          if (self.result_[1]) {
            if (current.errback)
              currentResult = current.errback.call(undefined, self.result_[0]);
          } else {
            if (current.callback)
              currentResult = current.callback.call(undefined, self.result_[0]);
          }
          current.deferred.callback(currentResult);
        } catch (err) {
          current.deferred.errback(err);
        }
      } catch (unused) {}
    }
  }

  function fire(self, value, isError) {
    if (self.fired_)
      throw new Error('already fired');

    self.fired_ = true;
    self.result_ = [value, isError];
    notify(self);
  }

  Deferred.prototype = {
    constructor: Deferred,

    fired_: false,
    result_: undefined,

    createPromise: function() {
      return {then: this.then.bind(this), cancel: this.cancel.bind(this)};
    },

    callback: function(value) {
      fire(this, value, false);
    },

    errback: function(err) {
      fire(this, err, true);
    },

    then: function(callback, errback) {
      var result = new Deferred(this.cancel.bind(this));
      this.listeners_.push({
        deferred: result,
        callback: callback,
        errback: errback
      });
      if (this.fired_)
        notify(this);
      return result.createPromise();
    },

    cancel: function() {
      if (this.fired_)
        throw new Error('already finished');
      var result;
      if (this.canceller_) {
        result = this.canceller_(this);
        if (!result instanceof Error)
          result = new Error(result);
      } else {
        result = new Error('cancelled');
      }
      if (!this.fired_) {
        this.result_ = [result, true];
        notify(this);
      }
    }
  };

  var modules = $freeze({
    get '@name'() {
      return NameModule;
    },
    get '@iter'() {
      return IterModule;
    }
  });

  // TODO(arv): Don't export this.
  global.Deferred = Deferred;

  function setupGlobals(global) {
    polyfillString(global.String);
    polyfillObject(global.Object);
    polyfillArray(global.Array);
  }

  setupGlobals(global);

  // Return the runtime namespace.
  var runtime = {
    Deferred: Deferred,
    addIterator: addIterator,
    assertName: assertName,
    createName: NameModule.Name,
    deleteProperty: deleteProperty,
    elementDelete: elementDelete,
    elementGet: elementGet,
    elementHas: elementHas,
    elementSet: elementSet,
    getIterator: getIterator,
    getProperty: getProperty,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    has: has,
    modules: modules,
  };

  // This file is sometimes used without traceur.js.
  global.$traceurRuntime = runtime;

})(typeof global !== 'undefined' ? global : this);

(function(e){if("function"==typeof bootstrap)bootstrap("osef",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeOsef=e}else"undefined"!=typeof window?window.Osef=e():global.Osef=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Aggregate = require("./domain/aggregate");
var EventBus = require("./domain/event_bus").EventBus;
exports.Aggregate = Aggregate;
exports.EventBus = EventBus;


},{"./domain/aggregate":2,"./domain/event_bus":3}],2:[function(require,module,exports){
"use strict";
var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var Aggregate = function() {
  'use strict';
  var $Aggregate = ($__createClassNoExtends)({
    constructor: function(identifier) {
      if (identifier === undefined) {
        this.identifier = generateUUID();
      }
      this.version = 0;
      this.uncommittedEvents = [];
    },
    snapshot: function() {
      throw new Error("Not implemented");
    },
    toEvent: function(name, data) {
      var event = {
        event: name,
        type: 'domain',
        payload: data || {}
      };
      if (!event.payload.id) {
        event.payload.id = this.identifier;
      }
      return event;
    },
    loadFromHistory: function(events) {
      events.forEach(function(e) {
        if (e.type == 'snapshot') {
          this.applySnapshot(e);
        } else {
          this.applyEvent(e);
        }
      }, this);
    },
    applySnapshot: function(event) {
      throw new Error("Not implemented");
    },
    applyEvent: function(event) {
      this[event.event](event.payload);
      if (event.head && this.version < event.head.revision) {
        this.version = event.head.revision;
      } else {
        event.head = {revision: ++this.version};
        this.uncommittedEvents.push(event);
      }
    },
    getType: function() {
      throw new Error("You must implement the getType() method of aggregates for now");
    }
  }, {});
  return $Aggregate;
}();
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r: (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
module.exports = Aggregate;


},{}],3:[function(require,module,exports){
"use strict";
function CustomEvent(event, params) {
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
}
;
CustomEvent.prototype = window.CustomEvent.prototype;
window.CustomEvent = CustomEvent;
var EventBus = {
  subscribe: function(stream, fn) {
    document.addEventListener(stream, function(e) {
      fn(e.detail);
    });
  },
  publish: function(stream, event) {
    var customEvent = new CustomEvent(stream, {detail: event});
    document.dispatchEvent(customEvent);
  }
};
exports.EventBus = EventBus;


},{}],4:[function(require,module,exports){
"use strict";
var ui = require("./ui");
var domain = require("./domain");
var storage = require("./storage");
exports.ui = ui;
exports.domain = domain;
exports.storage = storage;


},{"./domain":1,"./storage":5,"./ui":9}],5:[function(require,module,exports){
"use strict";
var __dependency1__ = require("./storage/db");
var Db = __dependency1__.Db;
var LocalstorageDb = __dependency1__.LocalstorageDb;
exports.Db = Db;
exports.LocalstorageDb = LocalstorageDb;


},{"./storage/db":8}],6:[function(require,module,exports){
"use strict";
var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var AbstractDb = function() {
  'use strict';
  var $AbstractDb = ($__createClassNoExtends)({
    constructor: function(namespace) {
      this.namespace = namespace;
    },
    put: function(key, value) {
      throw new Error('Not implemented');
    },
    get: function(key) {
      throw new Error('Not implemented');
    },
    del: function(key) {
      throw new Error('Not implemented');
    },
    exists: function(key) {
      throw new Error('Not implemented');
    },
    serialize: function(value) {
      return JSON.stringify(value);
    },
    deserialize: function(value) {
      if (typeof value != 'string') {
        return undefined;
      }
      try {
        return JSON.parse(value);
      } catch (e) {
        return value || undefined;
      }
    }
  }, {});
  return $AbstractDb;
}();
module.exports = AbstractDb;


},{}],7:[function(require,module,exports){
"use strict";
var $__superDescriptor = function(proto, name) {
  if (!proto) throw new TypeError('super is null');
  return Object.getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var AbstractDb = require("./abstract_db");
var LocalstorageDb = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $LocalstorageDb = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    put: function(key, value) {
      localStorage.setItem(this.prefix(key), this.serialize(value));
      return when.resolve(value);
    },
    get: function(key) {
      return when.resolve(this.deserialize(localStorage.getItem(this.prefix(key))));
    },
    exists: function(key) {
      return when.resolve(localStorage.getItem(this.prefix(key)) !== null);
    },
    del: function(key) {
      return when.resolve(localStorage.removeItem(this.prefix(key)));
    },
    prefix: function(key) {
      return this.namespace === null ? key: this.namespace + ':' + key;
    }
  }, {}, $__proto, $__super, false);
  return $LocalstorageDb;
}(AbstractDb);
module.exports = LocalstorageDb;


},{"./abstract_db":6}],8:[function(require,module,exports){
"use strict";
var LocalstorageDb = require("./adapters/localstorage_db");
var Db = {open: function(namespace) {
    return new LocalstorageDb(namespace);
  }};
exports.Db = Db;
exports.LocalstorageDb = LocalstorageDb;


},{"./adapters/localstorage_db":7}],9:[function(require,module,exports){
"use strict";
var View = require("./ui/view");
var StateManager = require("./ui/state_manager");
var ViewGroup = require("./ui/view_group");
var Layout = require("./ui/layout");
exports.View = View;
exports.StateManager = StateManager;
exports.ViewGroup = ViewGroup;
exports.Layout = Layout;


},{"./ui/layout":10,"./ui/state_manager":11,"./ui/view":12,"./ui/view_group":13}],10:[function(require,module,exports){
"use strict";
var $__superDescriptor = function(proto, name) {
  if (!proto) throw new TypeError('super is null');
  return Object.getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var View = require("./view");
var ViewGroup = require("./view_group");
var Layout = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $Layout = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", []);
      this.zones = [];
    },
    render: function() {
      $__superCall(this, $__proto, "render", []);
      this.append();
      for (var name in this.zones) {
        this[name] = new ViewGroup(this.zones[name]);
      }
      return this;
    }
  }, {}, $__proto, $__super, true);
  return $Layout;
}(View);
module.exports = Layout;


},{"./view":12,"./view_group":13}],11:[function(require,module,exports){
"use strict";
var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var StateManager = function() {
  'use strict';
  var $StateManager = ($__createClassNoExtends)({
    constructor: function() {
      this.states = [];
      this.default = null;
    },
    addState: function(path, cb) {
      var params = [];
      path = path.replace(/(\?)?\{([^}]+)\}/g, function(match, optional, param) {
        params.push({
          name: param,
          optional: (optional == '?') ? true: false
        });
        return '([\\w-]+)?';
      });
      this.states.push({
        regex: new RegExp(path),
        params: params,
        cb: cb
      });
    },
    defaultTo: function(state) {
      this.default = this.findState(state);
    },
    run: function() {
      this.transitionTo(location.hash);
      window.addEventListener("hashchange", this.hashChanged.bind(this), false);
    },
    hashChanged: function(event) {
      this.transitionTo(location.hash);
    },
    transitionTo: function(hash) {
      var state = (hash == '') ? this.default: this.findState(hash);
      var params = {}, matched = hash.match(state.regex);
      for (var i in state.params) {
        var param = state.params[i];
        params[param.name] = matched[parseInt(i) + 1];
      }
      state.cb(params);
    },
    findState: function(hash) {
      for (var k in this.states) {
        var state = this.states[k], matched = hash.match(state.regex);
        if (matched) {
          return state;
        }
      }
    }
  }, {});
  return $StateManager;
}();
module.exports = StateManager;


},{}],12:[function(require,module,exports){
"use strict";
var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var eventSplitter = /^(\S+)\s*(.*)$/;
var View = function() {
  'use strict';
  var $View = ($__createClassNoExtends)({
    constructor: function(context) {
      this.templateName = null;
      this.template = null;
      this.element = null;
      this.context = null;
      this.events = {};
      this.createElement();
      if (context) {
        this.setContext(context);
      }
    },
    setContext: function(context) {
      this.context = context;
      this.context.onChange(this.contextChanged.bind(this));
    },
    contextChanged: function() {
      this.rerender();
    },
    rerender: function() {
      this.detachEvents();
      this.render();
    },
    render: function() {
      if (this.template === null) {
        this.template = this.getTemplateFromName();
      }
      this.element.innerHTML = this.template(this.context);
      this.attachEvents();
      return this;
    },
    createElement: function() {
      this.element = document.createElement('div');
    },
    remove: function() {
      this.detachEvents();
      this.element.parentNode.removeChild(this.element);
    },
    append: function() {
      this.appendTo(document.body);
    },
    appendTo: function(elt) {
      elt.appendChild(this.element);
    },
    attachEvents: function() {
      for (var key in this.events) {
        var match = key.match(eventSplitter), eventName = match[1], selector = match[2], fn = this.events[key];
        this.$(selector).addEventListener(eventName, this[fn].bind(this), false);
      }
    },
    detachEvents: function() {},
    $: function(selector) {
      return this.element.querySelector(selector);
    },
    getTemplateFromName: function() {
      return JST[this.templateName];
    }
  }, {});
  return $View;
}();
module.exports = View;


},{}],13:[function(require,module,exports){
"use strict";
var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var ViewGroup = function() {
  'use strict';
  var $ViewGroup = ($__createClassNoExtends)({
    constructor: function(containerSelector) {
      this.container = this.getContainer(containerSelector);
      this.views = [];
      this.layoutTransition = new LayoutTransition();
    },
    show: function(view) {
      var that = this;
      return this.removeAllViews().then(function() {
        return that.addView(view);
      });
    },
    addView: function(view) {
      this.views.push(view);
      view.render().appendTo(this.container);
      return this.layoutTransition.addChild(this.container, view.element);
    },
    removeAllViews: function() {
      var promises = [];
      this.views.forEach(function(view, index) {
        promises.push(this.removeView(view, index));
      }, this);
      if (promises.length === 0) return when.resolve();
      return when.all(promises);
    },
    removeView: function(view, index) {
      if (index === undefined) {}
      this.views.splice(index, 1);
      return this.layoutTransition.removeChild(this.container, view.element).then(function() {
        view.remove();
      });
    },
    getContainer: function(containerSelector) {
      var container = document.querySelector(containerSelector);
      if (container === null) {
        throw new Error("Container " + containerSelector + " not found in the DOM");
      }
      return container;
    }
  }, {});
  return $ViewGroup;
}();
var LayoutTransition = function() {
  'use strict';
  var $LayoutTransition = ($__createClassNoExtends)({
    constructor: function() {
      this.animator = new AnimationManager();
      this.transitions = {
        'CHANGE_APPEARING': 'fadeIn',
        'CHANGE_DISAPPEARING': 'fadeOut',
        'CHANGING': 'pulse',
        'APPEARING': 'fadeIn',
        'DISAPPEARING': 'fadeOut'
      };
    },
    addChild: function(parentElt, elt) {
      return this.animator.animate(elt, this.transitions['APPEARING']);
    },
    removeChild: function(parentElt, elt) {
      return this.animator.animate(elt, this.transitions['DISAPPEARING']);
    }
  }, {});
  return $LayoutTransition;
}();
var AnimationManager = function() {
  'use strict';
  var $AnimationManager = ($__createClassNoExtends)({
    constructor: function() {
      this.animations = {
        'animation': ['animationend', 'transitionend'],
        'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
        'MozAnimation': ['animationend', 'transitionend'],
        'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
      };
    },
    animate: function(el, type) {
      var deferred = this.registerEndEvent(el, type);
      el.className += ' animated ' + type;
      return deferred.promise;
    },
    registerEndEvent: function(el, type) {
      var deferred = when.defer(), eventNames = this.getEventNames(el);
      if (!eventNames) {
        deferred.resolve(el);
      } else {
        var handler = function(e) {
          var animType = e.animationName || e.propertyName;
          if (animType && animType == type) {
            deferred.resolve(e.currentTarget);
          }
        };
        el.addEventListener(eventNames[0], handler);
        el.addEventListener(eventNames[1], handler);
      }
      return deferred;
    },
    getEventNames: function(el) {
      var a;
      for (a in this.animations) {
        if (el.style[a] !== undefined) {
          return this.animations[a];
        }
      }
    }
  }, {});
  return $AnimationManager;
}();
module.exports = ViewGroup;


},{}]},{},[4])(4)
});
;