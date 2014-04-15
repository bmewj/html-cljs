'use strict';

var Code = {};

(function(){

  /* Element registration */
  var elements = {};

  Code.load = function load(win) {
    var doc = win.document;

    var codeElements = doc.getElementsByClassName('code active');

    for (var i = 0; i < codeElements.length; i += 1)
      if (codeElements[i].tagName === 'SPAN')
        Code.registerElement(codeElements[i], win, doc);
  };

  Code.registerCodeElement = function(codeElement, win, doc) {
    var components = [];
    for (var i = 0; i < Code.components.length; i += 1) {
      var componentTargets = Code.util.expandTypes(Code.components[i].targets);

      if (componentTargets.indexOf('code') !== -1)
        components.push(Code.components[i]);
    }

    for (var i = 0; i < codeElement.children.length; i += 1)
      Code.registerElement(codeElement.children[i], win, doc);

    for (var i = 0; i < components.length; i += 1)
      if (typeof components[i].handler === 'function')
        components[i].handler(codeElement, win, doc);
  };

  Code.registerElement = function(element, win, doc) {
    if (!Code.util.isElement(element)) {
      for (var i = 0; i < element.children.length; i += 1)
        Code.registerElement(element.children[i]);

    } else {
      var components = [];
      for (var i = 0; i < Code.components.length; i += 1) {
        var componentTargets = Code.util.expandTypes(Code.components[i].targets);

        if (componentTargets.indexOf(Code.util.getElementType(element)) !== -1)
          components.push(Code.components[i]);
      }

      for (var i = 0; i < element.children.length; i += 1)
        Code.registerElement(element.children[i], win, doc);

      for (var i = 0; i < components.length; i += 1)
        if (typeof components[i].handler === 'function')
          components[i].handler(element, win, doc);
    }
  };

  /* Types */
  Code.types = [];

  Code.Type = function Type(name, groups) {
    this.name = name;
    this.groups = (typeof groups === 'string') ? [groups] : groups || [];

    return this;
  };

  Code.types.push(new Code.Type('code'));

  Code.types.push(new Code.Type('list', ['form', 'collection']));
  Code.types.push(new Code.Type('vector', ['form', 'collection']));

  Code.types.push(new Code.Type('quote', ['form', 'element']));
  Code.types.push(new Code.Type('symbol', ['form', 'element']));
  Code.types.push(new Code.Type('key', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('string', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('number', ['form', 'element', 'atom']));

  Code.types.push(new Code.Type('tag', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('error', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('insert', 'element'));

  Code.util = {
    expandType: function(type) {
      var types = [];

      for (var i = 0; i < Code.types.length; i += 1) {
        if (Code.types[i].name === type)
          return [type];

        if (Code.types[i].groups.indexOf(type) !== -1)
          types.push(Code.types[i].name);
      }

      return types;
    },
    expandTypes: function(types) {
      var expandedTypes = [];

      for (var i = 0; i < types.length; i += 1)
        expandedTypes = expandedTypes.concat(Code.util.expandType(types[i]));

      return expandedTypes;
    },
    isElement: function(element) {
      if (element.tagName !== 'SPAN')
        return false;

      for (var i = 0; i < Code.types.length; i += 1)
        if (element.classList.contains(Code.types[i].name))
          return true;

      return false;
    },
    getElementType: function(element) {
      for (var i = 0; i < Code.types.length; i += 1)
        if (element.classList.contains(Code.types[i].name))
          return Code.types[i].name;
    }
  };

  /* Components */
  Code.components = [];

  Code.Component = function Component(name, targets, handler) {
    this.name = name || 'untitled';
    this.handler = handler;

    this.targets = targets;

    return this;
  };

  /* Event system */
  Code.events = {};

  Code.addEventListener = function addEventListener(name, callback) {
    if (Code.events[name] === undefined || typeof callback !== 'function')
      return;

    Code.events[name].eventListeners.push(callback);
  };
  Code.removeEventListener = function removeEventListener(name, callback) {
    if (Code.events[name] === undefined || typeof callback !== 'function')
      return;

    var i = Code.events[name].eventListeners.indexOf(callback);
    if (i !== -1)
      delete Code.events[name].eventListeners[i];
  };

  Code.EventObject = function EventObject(name) {
    this.name = name;
    this.eventListeners = [];
    this.trigger = function() {
      for (var i = 0; i < this.eventListeners.length; i += 1)
        this.eventListeners[i].apply(this, arguments);
    };

    Code.events[name] = this;

    return this;
  };

  /* Element updating system */
  var updateEvent = new Code.EventObject('update');

  Code.updated = function updated(element) {
    updateEvent.trigger(element);

    var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    var doc = win.document;

    if (element.classList.contains('code'))
      Code.registerCodeElement(element, win, doc);
    else
      Code.registerElement(element, win, doc);

    if (!element.classList.contains('code') && element.parentElement !== null)
      Code.updated(element.parentElement);
  };

})();
