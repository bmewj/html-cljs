(function() {
  'use strict';

  Code.evaluator = {};

  Code.evaluator.evaluate = function evaluate(element, locals, globals) {
    if (!Code.util.isElement(element))
      return null;

    var code = Code.evaluator.elementToCode(element);

    // TODO: Interop with cljs-repl
    var value = null; // Return value

    return Code.evaluator.valueToElement(value);
  };

  Code.evaluator.elementToCode = function elementToCode(element) {
    return element.innerHTML || element.textContent;
  };

  Code.evaluator.valueToElement = function valueToElement(value) {

  };

})();
