(function() {
  'use strict';

  Code.evaluator = {};

  Code.evaluator.evaluate = function evaluate(element, locals, globals) {
    if (!Code.util.isElement(element))
      return null;

    var type = Code.util.getElementType(element);

    if (typeof Code.evaluator.types[type] === 'function')
      element = Code.evaluator.types[type](element, locals, globals).cloneNode(true);
    else
      element = element.cloneNode(true);

    Code.updateElement(element);

    return element;
  };

  /* Eval function for a variety of types */
  Code.evaluator.types = {
    'list': function(element, locals, globals) {
      var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
      var doc = win.document;

      var firstForm = Code.evaluator.getFirstForm(element.firstChild);
      if (firstForm === null)
        return Code.evaluator.createNIL(doc);

      var operator = Code.evaluator.evaluate(firstForm, locals, globals);

      switch (Code.util.getElementType(operator)) {
        case 'error':
          return operator;

        case 'native':
          var name = operator.firstChild.nodeValue;
          if (nativeMacros[name] === undefined)
            return Code.evaluator.createError(doc, 'Undefined native macro: ' + name);

          var args = [];
          var arg = firstForm.nextSibling;
          while ((arg = Code.evaluator.getFirstForm(arg)) !== null) {
            args.push(arg);
            arg = arg.nextSibling;
          }

          return nativeMacros[name].fn(doc, args);

        case 'function':


        case 'macro':


        default:
          return Code.evaluator.createError(doc, 'Cannot evaluate list with first element:' + Code.util.getElementType(operator));
      }
    },
    'vector': function(element, locals, globals) {
      var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
      var doc = win.document;

      var vector = doc.createElement('span');
      vector.classList.add('vector');
      vector.appendChild(doc.createTextNode('['));

      element = Code.evaluator.getFirstForm(element.firstChild);

      while (element !== null) {
        var form = Code.evaluator.evaluate(element, locals, globals);
        if (Code.util.getElementType(form) === 'error')
          return form; //Return errors immediately

        vector.appendChild(form);

        var insert = doc.createElement('span');
        insert.classList.add('insert');
        insert.appendChild(doc.createTextNode(' '));
        vector.appendChild(insert);

        element = Code.evaluator.getFirstForm(element.nextSibling);
      }

      if (insert !== undefined)
        insert.firstChild.nodeValue = ']';

      return vector;
    },
    'symbol': function(element, locals, globals) {
      var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
      var doc = win.document;

      var symbol = element.firstChild.nodeValue;

      if (symbol === 'js')
        return Code.evaluator.createNative(doc, 'js');

      else if (symbol === 'NIL')
        return element;

      else if (locals[symbol] !== undefined)
        return locals[symbol];

      else if (globals[symbol] !== undefined)
        return globals[symbol];

      else
        return Code.evaluator.createError(doc, 'Undefined symbol: ' + symbol);
    },
    'quote': function(element, locals, globals) {
      var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
      var doc = win.document;

      var quotedForm = Code.evaluator.getFirstForm(element.firstChild);

      if (quotedForm === null)
        return Code.evaluator.createError(doc, 'Invalid quote form');

      return quotedForm;
    }
  };

  /* Integrating functional macros/functions */
  var nativeMacros = {};

  Code.evaluator.NativeMacro = function NativeMacro(name, fn) {
    this.name = name;
    this.fn = fn;

    if (nativeMacros[name] === undefined)
      nativeMacros[name] = this;

    return this;
  };

  new Code.evaluator.NativeMacro('js', function(doc, args) {
    if (args.length !== 1)
      return Code.evaluator.createError(doc, 'Wrong amount of arguments passed to js');

    var symbol = args[0];
    if (Code.util.getElementType(symbol) !== 'symbol')
      return Code.evaluator.createError(doc, 'Expected symbol to be passed to js');

    var symbolName = symbol.firstChild.nodeValue;
    return Code.evaluator.createNative(doc, symbolName);
  });

  /* Useful functions */
  Code.evaluator.getFirstForm = function(element) {
    var forms = Code.util.expandType('form');

    var isEnd = function() {
      return (element === null);
    };
    var isForm = function() {
      return (element.nodeType === 1 &&
              Code.util.isElement(element) &&
              forms.indexOf(Code.util.getElementType(element)) !== -1);
    };

    while (!isEnd() && !isForm())
      element = element.nextSibling;

    return element;
  };
  Code.evaluator.createError = function(doc, message) {
    var error = doc.createElement('span');
    error.classList.add('error');
    error.appendChild(doc.createTextNode('Error: ' + message));
    return error;
  };
  Code.evaluator.createNative = function(doc, name) {
    var native = doc.createElement('span');
    native.classList.add('native');
    native.appendChild(doc.createTextNode(name));
    return native;
  };
  Code.evaluator.createNIL = function(doc) {
    var NIL = doc.createElement('span');
    NIL.classList.add('symbol');
    NIL.appendChild(doc.createTextNode('NIL'));
    return NIL;
  };

})();
