(function(e){if("function"==typeof bootstrap)bootstrap("testapp",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeTestapp=e}else"undefined"!=typeof window?window.Testapp=e():global.Testapp=e()})(function(){var define,ses,bootstrap,module,exports;
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
var $__1 = Osef.ui, View = $__1.View, StateManager = $__1.StateManager, Layout = $__1.Layout;
var TestView = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $TestView = ($__createClass)({constructor: function(context) {
      $__superCall(this, $__proto, "constructor", [context]);
      this.templateName = 'test';
    }}, {}, $__proto, $__super, true);
  return $TestView;
}(View);
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
var stateManager = new StateManager(), layout = new AppLayout();
layout.render();
layout.launchbar.addView(new TestView());


},{}]},{},[1])(1)
});
;