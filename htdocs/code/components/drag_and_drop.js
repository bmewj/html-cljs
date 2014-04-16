/* Allows forms to be dragged around */
'use strict';

(function() {
  var draggedElement = null;

  var dragAndCopyElements = [];
  var dropAndCopyElements = [];

  var canDrop = function(from, to) {
    /* An element cannot be dropped in itself (vector, list) */
    if (from === to)
      return false;

    var type = Code.util.getElementType(from);

    if (Code.util.expandType('collection').indexOf(type) === -1)
      return true;

    var parent = to.parentElement;
    while (parent !== null && parent !== from)
      parent = parent.parentElement;

    return (parent === null);
  };

  var removeElement = function(element) {
    var win = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    var doc = win.document;

    var parent = element.parentElement;
    var previous = element.previousSibling;
    var next = element.nextSibling;
    var last = parent.lastChild;

    while (previous !== null && previous.nodeType !== 1)
      previous = previous.previousSibling;

    while (next !== null && next.nodeType !== 1)
      next = next.nextSibling;

    while (last !== null && last.nodeType !== 1)
      last = last.previousSibling;

    var previousIsInsert = previous ? previous.classList.contains('insert') : false;
    var nextIsInsert = next ? next.classList.contains('insert') : false;

    if (!previousIsInsert && !nextIsInsert) {
      var insert = doc.createElement('span');
      insert.classList.add('insert');
      insert.appendChild(doc.createTextNode(' '));

      parent.insertBefore(insert, element);
    } else if (!previousIsInsert && nextIsInsert && next !== last) {
      parent.removeChild(next);
    } else if (previousIsInsert && nextIsInsert) {
      parent.removeChild(previous);
    }

    parent.removeChild(element);
  };
  var insertElement = function(element, insertionPoint) {
    var win = insertionPoint.ownerDocument.defaultView || insertionPoint.ownerDocument.parentWindow;
    var doc = win.document;

    var parent = insertionPoint.parentElement;
    var first = parent.firstChild;

    while (first !== null && first.nodeType !== 1)
      first = first.nextSibling;

    if (insertionPoint.classList.contains('insert')) {
      var insert = doc.createElement('span');
      insert.classList.add('insert');
      insert.appendChild(doc.createTextNode(' '));

      if (insertionPoint !== first)
        parent.insertBefore(insert, insertionPoint);

      parent.insertBefore(element, insertionPoint);
    } else {
      parent.insertBefore(element, insertionPoint);
      parent.removeChild(insertionPoint);
    }
  };

  var elementOnDragStart = function(e) {
    draggedElement = this;
    Code.clickSelect.selectElement(this);

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('dnd_code', null);

    e.stopPropagation();

    dragEvent.trigger(this);
  };
  var elementOnDragEnd = function(e) {
    Code.clickSelect.deselectAll();
    Code.clickSelect.deselect(this);

    draggedElement = null;
  };

  var elementOnDragEnter = function(e) {
    this.classList.add('drop');
  };
  var elementOnDragOver = function(e) {
    e.dataTransfer.dropEffect = 'move';

    e.preventDefault();
  };
  var elementOnDragLeave = function(e) {
    this.classList.remove('drop');
  };
  var elementOnDrop = function(e) {
    this.classList.remove('drop');

    var dragAndCopy = (dragAndCopyElements.indexOf(draggedElement) !== -1);
    var dropAndCopy = (dropAndCopyElements.indexOf(this) !== -1);

    if (canDrop(draggedElement, this)) {
      if (!dragAndCopy && !dropAndCopy)
        removeElement(draggedElement);
      else
        draggedElement = draggedElement.cloneNode(true);

      insertElement(draggedElement, this);
    }

    dropEvent.trigger(draggedElement, this);

    if (!dropAndCopy)
      Code.updated(draggedElement);

    draggedElement = null;
    e.stopPropagation();
  };

  /* Register components */
  var registerDragElement = function(element, dragAndCopy) {
    if (dragAndCopy)
      dragAndCopyElements.push(element);

    element.draggable = true;

    element.removeEventListener('dragstart', elementOnDragStart);
    element.addEventListener('dragstart', elementOnDragStart);
    element.removeEventListener('dragend', elementOnDragEnd);
    element.addEventListener('dragend', elementOnDragEnd);
  };

  var registerDropElement = function(element, dropAndCopy) {
    if (dropAndCopy)
      dropAndCopyElements.push(element);

    element.removeEventListener('dragenter', elementOnDragEnter);
    element.addEventListener('dragenter', elementOnDragEnter);
    element.removeEventListener('dragover', elementOnDragOver);
    element.addEventListener('dragover', elementOnDragOver);
    element.removeEventListener('dragleave', elementOnDragLeave);
    element.addEventListener('dragleave', elementOnDragLeave);
    element.removeEventListener('drop', elementOnDrop);
    element.addEventListener('drop', elementOnDrop);
  };

  var DragComponent = new Code.Component('dnd_drag', ['form'], {
    'dragstart': elementOnDragStart,
    'dragend': elementOnDragEnd
  }, function(element, win, doc) {
    element.draggable = true;
  });

  var DropComponent = new Code.Component('dnd_drop', ['collection', 'element'], {
    'dragenter': elementOnDragEnter,
    'dragover': elementOnDragOver,
    'dragleave': elementOnDragLeave,
    'drop': elementOnDrop
  });

  Code.components.push(DragComponent);
  Code.components.push(DropComponent);

  /* External Drag and Drop interface */
  Code.dragAndDrop = {
    registerDragElement: registerDragElement,
    registerDropElement: registerDropElement
  };

  /* Add event handling */
  var dragEvent = new Code.EventObject('drag');
  var dropEvent = new Code.EventObject('drop');
})();
