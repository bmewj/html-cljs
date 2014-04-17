html-lisp
=========

A very simple Lisp code creator in which all the Lisp data structures are HTML. The drag and drop feature enables for very quick creation of Lisp expressions (but not AS fast as just typing the code).

The idea behind this project is that all the data of the program should be expressed as HTML. This means that all data can be visualised and printed on a webpage.

## The language

Currently, the Lisp language supported is not an actual standard; the following forms exist:

- Lists
- Vectors
- Symbols
- Keys
- Numbers (integers, no support for decimals)
- Strings
- Tags (Used to annotate expressions)

I will slowly be moving towards implementing the Clojure language.

## Documentation

The inner workings of this app is rather simplistic. In order for everything to be extensible, the HTML elements do not rely heavily on Javascript. Rather, the Javascript side of things only *adds* behaviour; the Lisp code can be printed exactly as it would be without any of the JS code running.

### Types

Every HTML element related to Lisp code has a type, which is its class. The types are quite obvious for most forms; for example: lists are surrounded by a ``<span class=list>``, vectors are surrounded by a ``<span class=vector>``, etc...

While looking at the HTML structure you will also come across spans with the class ``insert``. These are insertion points for Lisp forms, they surve the purpose of dropping forms in-between--or at the end of--a list or vector.

```javascript
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
```

The above code can be found in ``htdocs/code/main.js``; in the JS code the HTML types are defined this way.

Each type has a name (which is also its class name) and an array of groups it is associated with. The ``form`` group, for example, is a group of all elements that are actual Lisp forms; the ``element`` group consists of all types that are not collections; the ``atom`` group might come in handy for evaluation, because it is all elements that evaluate to themselves.

### Components

Components are the interfaces used to add special behaviours to HTML Lisp structures.

An example of a special behaviour is the *click-to-select* feature. Whenever you click on a piece of code, it will highlight the form. This behaviour is defined in ``htdocs/code/components/click_select.js``. This behaviour acts on all types in the group ``form``. This is done by means of a Component object (defined in the click-to-select JS file) which binds to all ``form`` elements.

Another example would be the drag-and-drop feature. With drag-and-drop elements can be moved around within the Code window. Furthermore, elements can be dragged from template lists like the Standard Forms and Samples window. The way this feature works is that it defines two components: ``dnd_drag`` and ``dnd_drop``. The ``dnd_drag`` component binds to all types in the group ``form`` whilst the ``dnd_drop`` component binds to all types in the group ``element``; forms can be dragged and dropped on to other forms or insertion points.

## To-do

- [ ] Implement text-to-HTML parser.
- [x] Implement a basic evaluator.
- [ ] Add support for more Clojure data structures.
  
