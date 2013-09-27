(function(e){if("function"==typeof bootstrap)bootstrap("tests",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeTests=e}else"undefined"!=typeof window?window.Tests=e():global.Tests=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var $__1 = Osef.domain, Aggregate = $__1.Aggregate, AggregateState = $__1.AggregateState;
var Contact = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $Contact = ($__createClass)({
    constructor: function(identifier) {
      $__superCall(this, $__proto, "constructor", [identifier]);
      this.state = new ContactState();
    },
    create: function(name) {
      this.apply(this.toEvent('contactCreated', {
        id: this.identifier,
        name: name
      }));
    },
    getType: function() {
      return 'Contact';
    }
  }, {}, $__proto, $__super, true);
  return $Contact;
}(Aggregate);
var ContactState = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $ContactState = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    contactCreated: function(e) {
      this.id = e.id;
      this.name = e.name;
    }
  }, {}, $__proto, $__super, false);
  return $ContactState;
}(AggregateState);
module.exports = Contact;


},{}],2:[function(require,module,exports){
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
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var Projection = Osef.domain.Projection;
var ContactListProjection = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $ContactListProjection = ($__createClass)({
    constructor: function(store) {
      $__superCall(this, $__proto, "constructor", [store]);
      this.key = 'contact-list';
      this.initialState = new ContactList();
    },
    contactCreated: function(e) {
      return this.addOrUpdate(this.key, function(s) {
        s.addContact(e.name);
        return s;
      });
    }
  }, {}, $__proto, $__super, true);
  return $ContactListProjection;
}(Projection);
var ContactList = function() {
  'use strict';
  var $ContactList = ($__createClassNoExtends)({
    constructor: function() {
      this.contacts = [];
    },
    addContact: function(name) {
      this.contacts.push(name);
    }
  }, {});
  return $ContactList;
}();
module.exports = ContactListProjection;


},{}],3:[function(require,module,exports){
"use strict";
var TestView = require("./test_view");
var Contact = require("./contact");
var ContactListProjection = require("./contact_list_projection");
exports.TestView = TestView;
exports.Contact = Contact;
exports.ContactListProjection = ContactListProjection;


},{"./contact":1,"./contact_list_projection":2,"./test_view":4}],4:[function(require,module,exports){
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
var View = Osef.ui.View;
var TestView = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $TestView = ($__createClass)({constructor: function(context) {
      $__superCall(this, $__proto, "constructor", [context]);
      this.templateName = 'test';
    }}, {}, $__proto, $__super, true);
  return $TestView;
}(View);
module.exports = TestView;


},{}]},{},[3])(3)
});
;