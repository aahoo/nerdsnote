(function() {
  var meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
  function linkCss(href, id) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (id)
      link.id = id;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  linkCss('https://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.css');
  linkCss('https://cdn.jsdelivr.net/medium-editor/5.22.1/css/medium-editor.min.css');
  let getPath = path => (location.href.indexOf('data:text/html') == 0
    ? 'https://nerdsnote.com/'
    : '') + path;
  linkCss(getPath('styles/theme.css'), 'medium-editor-theme');
  linkCss(getPath('styles/main.css'));

  // extensions ////////////////////////////////////////////////////////////////

  var Close = MediumEditor.extensions.button.extend({
    name: 'close',
    // tagNames: ['mark'], contentDefault: '<b>H</b>',
    contentFA: '<strong>X</strong>',
    aria: 'Close',
    action: 'close',

    // init: function() { MediumEditor.extensions.button.prototype.init.call(this);
    //
    //   this.classApplier = rangy.createCssClassApplier('highlight', {
    // elementTagName: 'mark',     normalize: true,   }); },

    handleClick: function(/*event*/) {
      var toolbar = this.base.getExtensionByName('toolbar');
      if (toolbar) {
        toolbar.hideToolbar();
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  function init() {
    document.body.innerHTML = '<div id="action-bar"></div><div id="paper"><div class="markdown-body"><h1>Title<' +
        '/h1></div></div>';
    var editor = new MediumEditor('.markdown-body', {
      buttonLabels: 'fontawesome',
      elementsContainer: document.getElementById('action-bar'),
      toolbar: {
        buttons: [
          'close',
          'h1',
          'h2',
          'h3',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'anchor',
          'image',
          'quote',
          'orderedlist',
          'unorderedlist',
          'pre',
          'code'
        ],
        static: true,
        updateOnEmptySelection: true
      },
      anchor: {
        linkValidation: true
      },
      anchorPreview: {
        previewValueSelector: 'a',
        hideDelay: 500,
        showWhenToolbarIsVisible: true
      },
      autoLink: true,
      paste: {
        cleanPastedHTML: true,
        forcePlainText: false
      },
      extensions: {
        close: new Close(),
        hotstring: new MediumEditor.ext.Hotstring(),
        markdown: new MediumEditor.ext.MeMarkdown(function(md, _this) {
          var firstChild = _this.base.elements[0].firstChild;
          document.title = (firstChild && firstChild.textContent) || 'Note';
          location.hash = '//' + md; // encodeUrl(md);
        })
        // 'tabIndent': tabIndent, 'code': new MediumButton({label: '` `', start:
        // '<code>', end: '</code>'})
      }
    });
    // var cssLink = document.getElementById('medium-editor-theme');
    // document.getElementById('sel-themes').addEventListener('change', function() {
    //   cssLink.href = '../bower_components/medium-editor/dist/css/' + this.value
    // +     '.css'; }); opens links; this is somehow not possible in the default
    // behavior!
    document.querySelector('.markdown-body').addEventListener('click', function(e) {
      var el = e.target;
      if (e.defaultPrevented || el.nodeType != Node.ELEMENT_NODE || !el.matches('A, A *'))
        return;
      while (el.tagName != 'A')
        el = el.parentElement;
      window.location = el.href;
    });
    var converter = new showdown.Converter();
    var markdown = decodeUrl(location.hash.substr(location.hash.indexOf('//') + 2));
    markdown = markdown.replace(/(\[.*?\]\()(.+?)(\))/gm, function(match, p1, p2, p3) {
      return p1 + p2.split('"').join('%22') + p3;
    });
    var el = editor.elements[0];
    el.innerHTML = converter.makeHtml(markdown);
    document.title = (el.firstChild && el.firstChild.textContent) || 'Note';
  }
  // if (document.body)   init(); else   document.onload = init;

  if (window.attachEvent) {
    window.attachEvent('onload', init);
  } else {
    if (window.onload) {
      var curronload = window.onload;
      var newonload = function(evt) {
        curronload(evt);
        init(evt);
      };
      window.onload = newonload;
    } else {
      window.onload = init;
    }
  }
}());
