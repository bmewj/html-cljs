html-cljs
=========

A very simple [ClojureScript](https://github.com/kanaka/clojurescript) structural editor in which all the Lisp data structures are HTML. The drag and drop feature enables for interactive creation of s-expressions, building up a program as you go along.

To understand how html-cljs works you can watch [this](http://www.youtube.com/watch?v=0AcMRKsZvMM) demo.

## Documentation

The inner workings of this project are rather simple. In order for everything to be extensible, the HTML elements do not rely heavily on Javascript. Rather, the Javascript side of things only *adds* behaviour; the ClojureScript code can be printed exactly as it would be without any of the JS code running.

### Types

Every HTML element related to ClojureScript code has a type, which is its class. The types are quite obvious for most forms; for example: lists are surrounded by a ``<span class=list>``, vectors are surrounded by a ``<span class=vector>``, etc...

While looking at the HTML structure you will also come across spans with the class ``insert``. These are insertion points for Lisp forms, they serve the purpose of dropping forms in-between--or at the end of--a list, vector, or map.

```javascript
Code.types.push(new Code.Type('list', ['form', 'collection']));
Code.types.push(new Code.Type('vector', ['form', 'collection']));
Code.types.push(new Code.Type('map', ['form', 'collection']));

Code.types.push(new Code.Type('quote', ['form', 'element']));
Code.types.push(new Code.Type('symbol', ['form', 'element']));
Code.types.push(new Code.Type('key', ['form', 'element']));
Code.types.push(new Code.Type('string', ['form', 'element']));
Code.types.push(new Code.Type('number', ['form', 'element']));

Code.types.push(new Code.Type('tag', ['form', 'element']));
Code.types.push(new Code.Type('error', ['form', 'element']));
Code.types.push(new Code.Type('insert', 'element'));
```

The above code can be found in ``htdocs/code/main.js``; in the JS code the HTML types are defined this way.

Each type has a name (which is also its class name) and an array of groups it is associated with. The ``form`` group, for example, is a group of all elements that are actual Lisp forms; the ``element`` group consists of all types that are not collections.

### Components

Components are the interfaces used to add special behaviours to HTML ClojureScript structures.

An example of a special behaviour is the *click-to-select* feature. Whenever you click on a piece of code, it will highlight the form. This behaviour is defined in ``htdocs/code/components/click_select.js``. This behaviour acts on all types in the group ``form``. This is done by means of a Component object (defined in the click-to-select JS file) which binds to all ``form`` elements.

Another example would be the drag-and-drop feature. With drag-and-drop elements can be moved around within the Code window. Furthermore, elements can be dragged from template lists like the Standard Forms and Samples window. The way this feature works is that it defines two components: ``dnd_drag`` and ``dnd_drop``. The ``dnd_drag`` component binds to all types in the group ``form`` whilst the ``dnd_drop`` component binds to all types in the group ``element``; forms can be dragged and dropped on to other forms or insertion points.

### To-do

- [ ] Create Text-to-HTML Script
- [x] Create HTML-to-Text Script
