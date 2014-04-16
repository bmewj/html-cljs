/* Double-click edit allows you to edit symbols, keys, strings, numbers, and tags */
'use strict';

(function() {
  var editor = {
    codeElement: null,
    element: null,
    inputElement: null,
    text: ''
  };

  var closeEditor = function() {
    var codeElement = editor.codeElement;
    var element = editor.element;
    var inputElement = editor.inputElement;

    if (codeElement === null || element === null || inputElement === null)
      return;

    while (element.hasChildNodes())
      element.removeChild(element.lastChild);

    var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    var doc = win.document;

    var text = inputElement.value;
    element.appendChild(doc.createTextNode(text));

    Code.updated(element);

  };

  var openEditor = function() {
    var codeElement = editor.codeElement;
    var element = editor.element;
    var inputElement = editor.inputElement;

    var win = element.ownerDocument.defaultView || element.ownerDocument.parentView;
    var doc = win.document;

    if (inputElement === null) {
      inputElement = doc.createElement('input');
      inputElement.type = 'text';
      inputElement.className = 'editor';
      inputElement.addEventListener('input', inputChange);
      inputElement.addEventListener('blur', inputBlur);
      inputElement.addEventListener('keyup', inputKeyUp);
      editor.inputElement = inputElement;
    }

    var text = element.innerText;
    while (element.hasChildNodes())
      element.removeChild(element.lastChild);

    var type = Code.util.getElementType(element);

    inputElement.value = text;
    element.appendChild(inputElement);

    editor.text = inputElement.value;
    setWidth(inputElement);
    inputElement.focus();
  };

  var inputChange = function() {
    var type = Code.util.getElementType(editor.element);
    var text = editor.inputElement.value;

    editor.text = getNewValue(type, text, editor.text);

    if (editor.text !== text)
      editor.inputElement.value = editor.text;

    setWidth(this);
  };
  var inputBlur = function() {
    closeEditor();
  };
  var inputKeyUp = function(e) {
    if (e.keyCode === 13) //Enter key
      closeEditor();
  };

  var getNewValue = function(type, newText, oldText) {
    switch (type) {
      case 'symbol':
      case 'tag':
        if (newText.length === 0)
          return '_';
        else if (!isValidInput(newText))
          return oldText;
        else
          return newText;
        break;

      case 'string':
        if (newText.length < 2)
          return '""';
        else if (newText[0] !== '"' || newText[newText.length - 1] !== '"')
          return oldText;
        else
          return newText;
        break;

      case 'key':
        if (newText.length === 0)
          return ':';
        else if (newText[0] !== ':' || !isValidInput(newText.substr(1)))
          return oldText;
        else
          return newText;
        break;

      case 'number':
        if (newText.length === 0)
          return '0';

        var digits = '1234567890';
        for (var i = 0; i < newText.length; i += 1) {
          if (i === 0 && newText[i] === '-')
            continue;
          if (digits.indexOf(newText[i]) === -1)
            return oldText;
        }

        return newText;
        break;
    }
  };

  var isValidInput = function(text) {
    var invalid = ' \n\t\x0b\x0c\r,;()[]"`:';

    for (var i = 0; i < invalid.length; i += 1)
      if (text.indexOf(invalid[i]) !== -1)
        return false;

    return true;
  };

  var setWidth = function(element) {
    element.style.width = getWidth(element.value);
  };

  var elementOnDblClick = function(e) {
    closeEditor();

    var codeElement = this.parentElement;
    while (codeElement !== null && !codeElement.classList.contains('code'))
      codeElement = codeElement.parentElement;

    if (codeElement === null || codeElement === undefined)
      return;

    editor.codeElement = codeElement;
    editor.element = this;

    openEditor();

    e.stopPropagation();
  };

  /* Register components */
  var DblClickEditComponent = new Code.Component('dblclick_edit', ['symbol', 'key', 'string', 'tag', 'number'], {
    'dblclick': elementOnDblClick
  });

  Code.components.push(DblClickEditComponent);

  /* Input field size estimation */
  var getWidth = function(text) {
    return (text.length * 6.75).toString() + 'pt';
  };

  window.addEventListener('load', function() {
    var element = document.createElement('span');
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';
    element.style.fontFamily = '"Courier", "Courier New", monospace, serif';
    element.style.fontSize = '11pt';
    element.style.whiteSpace = 'nowrap';
    element.style.height = 'auto';
    element.style.width = 'auto';
    element.appendChild(document.createTextNode(''));
    document.body.appendChild(element);

    getWidth = function(text) {
      element.childNodes[0].nodeValue = text;
      return (element.clientWidth + 1).toString() + 'px';
    };
  });
})();
