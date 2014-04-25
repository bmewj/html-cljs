(function() {
  'use strict';

  // Add evaluator dependencies
  goog.addDependency("base.js", ['goog'], []);
  goog.addDependency("../cljs/core.js", ['cljs.core'], ['goog.array', 'goog.object', 'goog.string.format', 'goog.string.StringBuffer', 'goog.string']);
  goog.addDependency("../clojure/string.js", ['clojure.string'], ['cljs.core', 'goog.string.StringBuffer', 'goog.string']);
  goog.addDependency("../cljs/io.js", ['cljs.io', 'cljs.io.File'], ['cljs.core']);
  goog.addDependency("../cljs/analyzer.js", ['cljs.analyzer'], ['cljs.core', 'clojure.string']);
  goog.addDependency("../cljs/reader.js", ['cljs.reader', 'cljs.reader.StringReader', 'cljs.reader.PushbackReader', 'cljs.reader.IndexingPushbackReader'], ['cljs.core', 'cljs.analyzer', 'clojure.string', 'goog.string']);
  goog.addDependency("../cljs/compiler.js", ['cljs.compiler'], ['cljs.core', 'cljs.reader', 'cljs.analyzer', 'clojure.string', 'cljs.io']);
  goog.addDependency("../cljs/repl.js", ['cljs.repl', 'cljs.user'], ['cljs.core', 'cljs.reader', 'cljs.compiler', 'cljs.analyzer']);

  goog.require('cljs.core');
  goog.require('cljs.repl');

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
    return null;
  };

})();
