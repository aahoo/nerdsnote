(function() {
  'use strict';

  var Hotstring = MediumEditor.Extension.extend({
    name: 'hotstring',
    init: function() {
      this.subscribe('editableKeypress', this.onKeypress.bind(this));
    },
    onKeypress: function(keyPressEvent) {

      function selectElementText(el) {
        var sel,
          range;
        if (window.getSelection && document.createRange) {
          sel = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(el);
          range.select();
        }
      }

      if (MediumEditor.util.isKey(keyPressEvent, [MediumEditor.util.keyCode.SPACE])) {
        var str = this.base.getSelectedParentElement().textContent;
        if (str == '1.' && this.base.getExtensionByName('orderedlist')) {
          this.base.execAction('insertorderedlist');
          this.base.getSelectedParentElement().textContent = this.base.getSelectedParentElement().textContent.slice(2).trim();
        } else if (str == '-' && this.base.getExtensionByName('unorderedlist')) {
          this.base.execAction('insertunorderedlist');
          this.base.getSelectedParentElement().textContent = this.base.getSelectedParentElement().textContent.slice(1).trim();
        } else if (str == '#' || str == '##' || str == '###' || str == '####') {
          selectElementText(this.base.getSelectedParentElement());
          this.base.execAction('append-h' + str.length);
        } else if (str == '>') {
          selectElementText(this.base.getSelectedParentElement());
          this.base.execAction('append-blockquote');
        }
      }
    }
  });

  MediumEditor.ext = MediumEditor.ext || {};
  MediumEditor.ext.Hotstring = Hotstring;
}());
