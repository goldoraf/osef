(function(e){if("function"==typeof bootstrap)bootstrap("testapp",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeTestapp=e}else"undefined"!=typeof window?window.Testapp=e():global.Testapp=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var BoardsView = require("./views/boards");
var BoardView = require("./views/board");
var AppLayout = require("./views/layout");
var BoardListProjection = require("./domain/projections/board_list");
var BoardProjection = require("./domain/projections/board");
var __dependency1__ = require("./domain/board");
var Board = __dependency1__.Board;
var CardList = __dependency1__.CardList;
var $__0 = Osef.ui, StateManager = $__0.StateManager, ViewContext = $__0.ViewContext;
var $__0 = Osef.storage, EventStore = $__0.EventStore, KeyValueStore = $__0.KeyValueStore, LocalstorageEventStoreAdapter = $__0.LocalstorageEventStoreAdapter;
var EventBus = Osef.wires.EventBus;
var eventStore = new EventStore(new LocalstorageEventStoreAdapter('testapp:events')), docStore = KeyValueStore.open('testapp:projections'), boardListProj = new BoardListProjection(docStore), boardProj = new BoardProjection(docStore);
EventBus.subscribe('ui.createBoard', function(msg, data) {
  var board = new Board();
  board.create(data.name);
  eventStore.appendToStream(board.getStreamId(), 0, board.changes);
});
EventBus.subscribe('ui.createList', function(msg, data) {
  var board = new Board(data.boardId);
  var eventStream = eventStore.loadEventStream(board.getStreamId());
  board.loadFromHistory(eventStream.events);
  var list = board.createList(data.title);
  eventStore.appendToStream(list.getStreamId(), 0, list.changes);
});
EventBus.subscribe('ui.createCard', function(msg, data) {
  var list = new CardList(data.listId);
  var eventStream = eventStore.loadEventStream(list.getStreamId());
  list.loadFromHistory(eventStream.events);
  var card = list.createCard(data.title);
  eventStore.appendToStream(card.getStreamId(), 0, card.changes);
});
EventBus.subscribe('domain.board-*', function(msg, data) {
  boardListProj.project(data);
  boardProj.project(data);
});
EventBus.subscribe('domain.cardlist-*', function(msg, data) {
  boardProj.project(data);
});
EventBus.subscribe('domain.card-*', function(msg, data) {
  boardProj.project(data);
});
var stateManager = new StateManager(), layout = new AppLayout();
layout.render();
stateManager.addState('boards', function(params) {
  var view = new BoardsView();
  boardListProj.getOrCreate('board-list').then(function(list) {
    view.setContext(list);
    layout.main.show(view);
  });
});
stateManager.addState('board/{id}', function(params) {
  var view = new BoardView();
  boardProj.get(params.id).then(function(board) {
    view.setContext(board);
    layout.main.show(view);
  });
});
stateManager.defaultTo('boards');
stateManager.run();


},{"./domain/board":2,"./domain/projections/board":4,"./domain/projections/board_list":5,"./views/board":6,"./views/boards":7,"./views/layout":8}],2:[function(require,module,exports){
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
var Card = require("./card");
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
    createList: function(title) {
      var list = new CardList();
      list.create(this.identifier, title);
      return list;
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
var CardList = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $CardList = ($__createClass)({
    constructor: function(identifier) {
      $__superCall(this, $__proto, "constructor", [identifier]);
      this.state = new CardListState();
    },
    create: function(boardId, title) {
      this.apply(this.toEvent('cardListCreated', {
        id: this.identifier,
        boardId: boardId,
        title: title
      }));
    },
    createCard: function(title) {
      var card = new Card();
      card.create(this.state.boardId, this.state.id, title);
      return card;
    },
    getType: function() {
      return 'CardList';
    }
  }, {}, $__proto, $__super, true);
  return $CardList;
}(Aggregate);
var CardListState = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $CardListState = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    cardListCreated: function(e) {
      this.id = e.id;
      this.title = e.title;
      this.boardId = e.boardId;
    }
  }, {}, $__proto, $__super, false);
  return $CardListState;
}(AggregateState);
exports.Board = Board;
exports.CardList = CardList;


},{"./card":3}],3:[function(require,module,exports){
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
var Card = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $Card = ($__createClass)({
    constructor: function(identifier) {
      $__superCall(this, $__proto, "constructor", [identifier]);
      this.state = new CardState();
    },
    create: function(boardId, listId, title) {
      this.apply(this.toEvent('cardCreated', {
        id: this.identifier,
        listId: listId,
        boardId: boardId,
        title: title
      }));
    },
    getType: function() {
      return 'Card';
    }
  }, {}, $__proto, $__super, true);
  return $Card;
}(Aggregate);
var CardState = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $CardState = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    cardCreated: function(e) {
      this.id = e.id;
      this.title = e.title;
      this.listId = e.listId;
      this.boardId = e.boardId;
    }
  }, {}, $__proto, $__super, false);
  return $CardState;
}(AggregateState);
module.exports = Card;


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
var Projection = Osef.domain.Projection;
var BoardProjection = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardProjection = ($__createClass)({
    constructor: function() {
      $__superCall(this, $__proto, "constructor", arguments);
    },
    boardCreated: function(e) {
      return this.add(e.id, function(s) {
        s.id = e.id;
        s.name = e.name;
        return s;
      });
    },
    cardListCreated: function(e) {
      return this.update(e.boardId, function(s) {
        s.cardLists.push({
          id: e.id,
          title: e.title,
          cards: []
        });
        return s;
      });
    },
    cardCreated: function(e) {
      return this.update(e.boardId, function(s) {
        s.cardLists.filter(function(list) {
          return list.id == e.listId;
        })[0].cards.push({
          id: e.id,
          title: e.title
        });
        return s;
      });
    }
  }, {}, $__proto, $__super, false);
  return $BoardProjection;
}(Projection);
module.exports = BoardProjection;


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


},{}],6:[function(require,module,exports){
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
var EventBus = Osef.wires.EventBus;
var BoardView = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardView = ($__createClass)({
    constructor: function(context) {
      $__superCall(this, $__proto, "constructor", [context]);
      this.templateName = 'board';
      this.events = {
        'submit form.create-list': 'createList',
        'submit form.create-card': 'createCard'
      };
    },
    setContext: function(context) {
      $__superCall(this, $__proto, "setContext", [context]);
      var that = this;
      EventBus.subscribe('projections.' + context.id + '.changed', function(msg, data) {
        that.context = data;
        that.contextChanged();
      });
    },
    createList: function(e) {
      e.preventDefault();
      this.trigger('ui.createList', {
        boardId: this.context.id,
        title: this.$('form.create-list').title.value
      });
    },
    createCard: function(e) {
      e.preventDefault();
      var form = this.$('form.create-card');
      this.trigger('ui.createCard', {
        listId: form.listId.value,
        title: form.title.value
      });
    }
  }, {}, $__proto, $__super, true);
  return $BoardView;
}(View);
module.exports = BoardView;


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
var View = Osef.ui.View;
var EventBus = Osef.wires.EventBus;
var BoardsView = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $BoardsView = ($__createClass)({
    constructor: function(context) {
      $__superCall(this, $__proto, "constructor", [context]);
      this.templateName = 'boards';
      this.events = {'submit #create-board': 'createBoard'};
    },
    setContext: function(context) {
      $__superCall(this, $__proto, "setContext", [context]);
      var that = this;
      EventBus.subscribe('projections.board-list.changed', function(msg, data) {
        that.context = data;
        that.contextChanged();
      });
    },
    createBoard: function(e) {
      e.preventDefault();
      this.trigger('ui.createBoard', {name: this.$('#create-board').name.value});
    }
  }, {}, $__proto, $__super, true);
  return $BoardsView;
}(View);
module.exports = BoardsView;


},{}],8:[function(require,module,exports){
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
        header: 'header',
        main: '#main',
        footer: 'footer'
      };
    }}, {}, $__proto, $__super, true);
  return $AppLayout;
}(Layout);
module.exports = AppLayout;


},{}]},{},[1])(1)
});
;