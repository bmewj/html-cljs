window.addEventListener('load', function() {
  Code.load(window);

  /* Templates */
  var formsList = document.getElementsByClassName('template')

  for (var i = 0; i < formsList.length; i += 1)
    for (var j = 0; j < formsList[i].children.length; j += 1) {
      var li = formsList[i].children[j];
      var code = li.getElementsByClassName('code')[0];
      var form = code.firstChild;

      Code.dragAndDrop.registerDragElement(form, true);
    }

  /* Customisation */
  var customList = document.getElementsByClassName('custom')[0];
  var dropElements = [];

  for (var i = 0; i < customList.children.length; i += 1) {
    var li = customList.children[i];
    var code = li.getElementsByClassName('code')[0];
    var form = code.firstChild;

    dropElements.push(form);
    Code.dragAndDrop.registerDragElement(form, true);
    Code.dragAndDrop.registerDropElement(form, true);
  }

  Code.addEventListener('drop', function(draggedElement, droppedElement) {
    var i = dropElements.indexOf(droppedElement);
    if (i !== -1) {
      var form = draggedElement;

      dropElements[i] = form;
      Code.dragAndDrop.registerDragElement(form, true);
      Code.dragAndDrop.registerDropElement(form, true);

      if (dropElements.length - 1 === i) {
        var li = document.createElement('li');
        var code = document.createElement('span');
        code.className = 'code';
        var form = document.createElement('span');
        form.className = 'tag';
        form.appendChild(document.createTextNode('Drop a form here.'));
        code.appendChild(form);
        li.appendChild(code);
        customList.appendChild(li);

        dropElements.push(form);
        Code.dragAndDrop.registerDragElement(form, true);
        Code.dragAndDrop.registerDropElement(form, true);
      }
    }
  });

  /* Evaluation */
  /*var globals = {};
  var input = document.getElementById('input');
  var output = document.getElementById('output');
  Code.addEventListener('update', function(element) {
    if (element !== input)
      return;

    while (output.firstChild !== null)
      output.removeChild(output.firstChild);

    var result = Code.evaluator.evaluate(element.firstChild, globals, {});
    Code.attachComponent(result, 'click_select_2');
    Code.attachComponent(result, 'dnd_drag');

    output.appendChild(result);
  });*/
});
