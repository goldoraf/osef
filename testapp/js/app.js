(function(e){if("function"==typeof bootstrap)bootstrap("testapp",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeTestapp=e}else"undefined"!=typeof window?window.Testapp=e():global.Testapp=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var BoardsView = require("./views/boards");
var AppLayout = require("./views/layout");
var Board = require("./domain/board");
var BoardListProjection = require("./domain/projections/board_list");
var $__0 = Osef.ui, StateManager = $__0.StateManager, ViewContext = $__0.ViewContext;
var $__0 = Osef.storage, EventStore = $__0.EventStore, KeyValueStore = $__0.KeyValueStore, LocalstorageEventStoreAdapter = $__0.LocalstorageEventStoreAdapter;
var EventBus = Osef.wires.EventBus;
var eventStore = new EventStore(new LocalstorageEventStoreAdapter('testapp')), docStore = KeyValueStore.open('testapp'), boardListProj = new BoardListProjection(docStore);
EventBus.subscribe('uiCreateBoard', function(msg, data) {
  var board = new Board();
  board.create(data.name);
  eventStore.appendToStream(board.getStreamId(), 0, board.changes);
});
EventBus.subscribe('domain.board-*', function(msg, data) {
  boardListProj.project(data);
});
var stateManager = new StateManager(), layout = new AppLayout();
layout.render();
stateManager.addState('boards', function(params) {
  var view = new BoardsView();
  docStore.get('board-list').then(function(list) {
    view.setContext(new ViewContext(list));
    layout.main.show(view);
  });
});
stateManager.defaultTo('boards');
stateManager.run();


},{"./domain/board":2,"./domain/projections/board_list":3,"./views/boards":4,"./views/layout":5}],2:[function(require,module,exports){
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
var Board = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $Board = ($__createClass)({
    constructor: function(identifier) {
      $__superCall(this, $__proto, "constructor", [identifier]);
      this.state = new BoardState();
    },
    create: function(name) {
      this.apply(this.toEvent('boardCreated', {
        id: this.identifier,
        name: name
      }));
    },
    getType: function() {
      return 'Board';
    }
  }, {}, $__proto, $__super, true);
  return $Board;
}(Aggregate);
var BoardState = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardState = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    boardCreated: function(e) {
      this.id = e.id;
      this.name = e.name;
    }
  }, {}, $__proto, $__super, false);
  return $BoardState;
}(AggregateState);
module.exports = Board;


},{}],3:[function(require,module,exports){
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
var BoardListProjection = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardListProjection = ($__createClass)({
    constructor: function(store) {
      $__superCall(this, $__proto, "constructor", [store]);
      this.key = 'board-list';
      this.initialState = new BoardList();
    },
    boardCreated: function(e) {
      return this.addOrUpdate(this.key, function(s) {
        s.boards.push({
          id: e.id,
          name: e.name
        });
        return s;
      });
    }
  }, {}, $__proto, $__super, true);
  return $BoardListProjection;
}(Projection);
var BoardList = function() {
  'use strict';
  var $BoardList = ($__createClassNoExtends)({constructor: function() {
      this.boards = [];
    }}, {});
  return $BoardList;
}();
module.exports = BoardListProjection;


},{}],4:[function(require,module,exports){
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
var BoardsView = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardsView = ($__createClass)({
    constructor: function(context) {
      $__superCall(this, $__proto, "constructor", [context]);
      this.templateName = 'boards';
      this.events = {'submit #create-board': 'createBoard'};
    },
    createBoard: function(e) {
      e.preventDefault();
      this.trigger('uiCreateBoard', {name: this.$('#create-board').name.value});
    }
  }, {}, $__proto, $__super, true);
  return $BoardsView;
}(View);
module.exports = BoardsView;


},{}],5:[function(require,module,exports){
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
var Layout = Osef.ui.Layout;
var AppLayout = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $AppLayout = ($__createClass)({constructor: function() {
      $__superCall(this, $__proto, "constructor", []);
      this.templateName = 'layout';
      this.zones = {
        launchbar: '#launchbar',
        main: '#main',
        footer: '#footer'
      };
    }}, {}, $__proto, $__super, true);
  return $AppLayout;
}(Layout);
module.exports = AppLayout;


},{}]},{},[1])(1)
});
;