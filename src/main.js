var Code = {};

(function(){
  'use strict';

  /* Element registration */
  Code.load = function load(win) {
    var doc = win.document;

    var codeElements = doc.getElementsByClassName('code active');

    for (var i = 0; i < codeElements.length; i += 1)
      if (codeElements[i].tagName === 'SPAN')
        Code.registerElement(codeElements[i]);
  };

  Code.registerElement = function(element) {
    if (!Code.util.isElement(element)) {
      for (var i = 0; i < element.children.length; i += 1)
        Code.registerElement(element.children[i]);

    } else {
      for (var i = 0; i < element.children.length; i += 1)
        Code.registerElement(element.children[i]);

      var componentNames = Code.util.getComponentsForElement(element);
      for (var i = 0; i < componentNames.length; i += 1) {
        var componentName = componentNames[i];
        Code.attachComponent(element, componentName);
      }
    }
  };

  Code.updateElement = function(element, stopBubbling) {
    updateEvent.trigger(element);

    if (!Code.util.isElement(element)) {
      for (var i = 0; i < element.children.length; i += 1)
        Code.updateElement(element.children[i], true);

    } else {
      for (var i = 0; i < element.children.length; i += 1)
        Code.updateElement(element.children[i], true);

      var componentNames = Code.util.getElementComponents(element);
      for (var i = 0; i < componentNames.length; i += 1) {
        var componentName = componentNames[i];
        Code.attachComponent(element, componentName);
      }
    }

    if (stopBubbling)
      return;

    element = element.parentElement;
    while (element !== null && !element.classList.contains('code')) {
      updateEvent.trigger(element);
      element = element.parentElement;
    }

    if (element !== null)
      updateEvent.trigger(element);
  };

  Code.attachComponent = function(element, componentName) {
    if (!element.hasAttribute('data-components'))
      element.setAttribute('data-components', componentName);
    else {
      var componentNames = element.getAttribute('data-components').split(' ');
      if (componentNames.indexOf(componentName) === -1) {
        componentNames.push(componentName);
        element.setAttribute('data-components', componentNames.join(' '));
      }
    }

    var component = Code.components[componentName];

    var events = Object.keys(component.events);

    for (var i = 0; i < events.length; i += 1) {
      var eventName = events[i];
      element.removeEventListener(eventName, component.events[eventName], false);
      element.addEventListener(eventName, component.events[eventName], false);
    }

    if (typeof component.initialise === 'function')
      component.initialise(element);
  };

  Code.detachComponent = function(element, componentName) {
    if (!element.hasAttribute('data-components'))
      return;
    else {
      var componentNames = element.getAttribute('data-components').split(' ');

      var i = componentNames.indexOf(componentName);
      if (i === -1)
        return;

      componentNames.splice(i, 1);
      element.setAttribute('data-components', componentNames.join(' '));
    }

    var component = Code.components[componentName];

    var events = Object.keys(component.events);

    for (var i = 0; i < events.length; i += 1) {
      var eventName = events[i];
      element.removeEventListener(eventName, component.events[eventName], false);
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
  Code.types.push(new Code.Type('map', ['form', 'collection']));

  Code.types.push(new Code.Type('function', ['form', 'collection', 'atom']));
  Code.types.push(new Code.Type('macro', ['form', 'collection', 'atom']));

  Code.types.push(new Code.Type('quote', ['form', 'element']));
  Code.types.push(new Code.Type('symbol', ['form', 'element']));
  Code.types.push(new Code.Type('key', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('string', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('number', ['form', 'element', 'atom']));

  Code.types.push(new Code.Type('tag', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('error', ['form', 'element', 'atom']));
  Code.types.push(new Code.Type('native', ['form', 'element', 'atom']));

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
    getTypeInformation: function(type) {
      for (var i = 0; i < Code.types.length; i += 1)
        if (Code.types[i].name === type)
          return Code.types[i];

      return null;
    },
    isElement: function(element) {
      if (element.tagName !== 'SPAN')
        return false;

      return (Code.util.getElementType(element) !== undefined);
    },
    getElementType: function(element) {
      for (var i = 0; i < Code.types.length; i += 1)
        if (element.classList.contains(Code.types[i].name))
          return Code.types[i].name;
    },
    getComponentsForType: function(type) {
      var components = [];
      var componentNames = Object.keys(Code.components);

      for (var i = 0; i < componentNames.length; i += 1) {
        var componentName = componentNames[i];
        var component = Code.components[componentName];
        var componentTargets = Code.util.expandTypes(component.targets);
        if (componentTargets.indexOf(type) !== -1)
          components.push(componentName);
      }

      return components;
    },
    getComponentsForElement: function(element) {
      return Code.util.getComponentsForType(Code.util.getElementType(element));
    },
    getElementComponents: function(element) {
      return element.hasAttribute('data-components') ? element.getAttribute('data-components').split(' ') : [];
    }
  };

  /* Components */
  Code.components = {};

  Code.Component = function Component(name, targets, events, initialise) {
    this.name = name || 'untitled';
    this.targets = targets;
    this.events = events;
    this.initialise = initialise;

    Code.components[name] = this;

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
      Code.events[name].eventListeners.splice(i, 1);
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

  /* Element to Text */
  Code.convertToText = function convertToText(element) {
    if (!Code.util.isElement(element))
      return element.innerHTML || element.textContent || element.value;

    var child = element.firstChild,
        text = [];
    while (child !== null) {
      text.push(Code.convertToText(child));
      child = child.nextSibling;
    }

    return text.join('');
  };

})();
