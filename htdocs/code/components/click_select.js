/* Click select enables focus to change */
'use strict';

(function() {
  var codeElements = [];

  var selectedElement = null;

  var deselectAll = function() {
    for (var i = 0; i < codeElements.length; i += 1)
      deselect(codeElements[i]);
  };

  var deselect = function(codeElement) {
    var selectedElements = codeElement.getElementsByClassName('selected');
    if (selectedElements.length === 1)
      selectedElements[0].classList.remove('selected');
  };

  var deselectElement = function(element) {
    if (element.classList.contains('selected'))
      element.classList.remove('selected');
    else
      deselect(element);
  };

  var selectElement = function(element) {
    if (element === selectedElement)
      return;

    deselectAll();

    element.classList.add('selected');
    selectedElement = element;
    selectionChangeEvent.trigger(this);
  };

  var elementOnClick = function(e) {
    selectElement(this);
    e.stopPropagation();
  };

  /* Register components */
  var clickSelectComponent1 = new Code.Component('click_select_1', ['code'], {},
    function(codeElement, win, doc) {
      if (codeElements.indexOf(codeElement) === -1)
        codeElements.push(codeElement);
  });

  var clickSelectComponent2 = new Code.Component('click_select_2', ['form'], {
    'click': elementOnClick
  });

  Code.components.push(clickSelectComponent1);
  Code.components.push(clickSelectComponent2);

  /* Add event handling support */
  var selectionChangeEvent = new Code.EventObject('selection-change');

  Code.clickSelect = {
    selectElement: selectElement,
    deselectAll: deselectAll,
    deselect: deselectElement
  };

  /* Updating support */
  Code.addEventListener('update', function(element) {
    if (element.classList.contains('code'))
      deselectAll();
  });
})();
