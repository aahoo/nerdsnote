(function() {
  'use strict';
  /**
   * A class to create timer objects.
   * @class Timer
   *
   * @constructor
   *
   * @param {function} callback
   * @param {number} [delay] if not specified, timer will not start.
   */

  window.Timer = function(callback, delay) {
    var _timeoutID,
      timer = {
        delay: delay,
        callback: callback,
        params: Array.prototype.slice.call(arguments, 2),
        active: false
      };

    function _callback() {
      timer.active = false;
      callback.apply(callback, timer.params);
    }

    function set() {
      timer.active = true;
      return _timeoutID = window.setTimeout(_callback, timer.delay);
    }

    function clear() {
      if (typeof _timeoutID !== 'number')
        return;
      window.clearTimeout(_timeoutID);
      timer.active = false;
      _timeoutID = null;
    }

    function refresh(newDelay) {
      if (newDelay)
        timer.delay = newDelay;
      clear();
      set();
    }

    if (typeof delay == 'number')
      set();
    return Object.assign(timer, {
      set: set,
      clear: clear,
      refresh: refresh
    });
  };

}());

(function() {
  'use strict';

  var HOMEPAGE = 'https://nerdsnote.com',
    store = {
      timer: null
    };

  function resetStore() {
    store.syncingTab = null;
    store.syncingBookmark = null;
  }

  function isBookmarked(tab, store) {

    function callback(list) {
      if (list.length > 0) {
        if (tab.url.length <= HOMEPAGE.length + 2) {
          resetStore();
          console.log('Writing on a new note ...');
        } else {
          store.syncingTab = tab;
          store.syncingBookmark = list[0].id;
          console.log('Syncing to bookmark ...');
        }
      }
      function sync(store) {
        if(store.tab && store.tab.title.indexOf(HOMEPAGE) == 0 || store.syncingBookmark === null)
          return;
        chrome.bookmarks.update(store.syncingBookmark, {
          url: store.tab.url,
          title: store.tab.title
        });
        window.setTimeout(function(store) {
          store.timer = null;
        }, 2000, store);
      }
      if (typeof store.syncingBookmark === 'string') {
        store.tab = tab;
        if (store.timer === null) {
          sync(store);
          store.timer = window.Timer(sync, 1000, store);
        } else
          store.timer.refresh();
        }
      }
    chrome.bookmarks.search({
      url: tab.url
    }, callback);
  }

  // Called on browser_action click.
  chrome.browserAction.onClicked.addListener(function(/*tab*/) {
    chrome.tabs.create({
      'url': HOMEPAGE
    }, function(/*tab*/) {
      // Tab opened.
    });
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // TODO(2) add a timer
    if (!tab.active || tab.url.indexOf(HOMEPAGE) != 0)
      return;
    isBookmarked(tab, store);
  });
  //
  chrome.tabs.onActivated.addListener(function(info) {
    resetStore();
    chrome.tabs.get(info.tabId, function(tab) {
      if (!tab.active || tab.url.indexOf(HOMEPAGE) != 0)
        return;
      isBookmarked(tab, store);
    });
  });
  //
  // chrome.tabs.onCreated.addListener(function(tab) {   console.log('onCreated',
  // tab); });
}());
