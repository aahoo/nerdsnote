window.log = console.log;

/**
 * Namespace for utility functions.
 * @namespace __
 */

window.__ = (function() {

  /**
   * Convenience method for preventing default on DOM event object. Either
   * returns `defaultPrevented` property or calls `preventDefault`.
   *
   * @method ePrevent
   * @param {object} e DOM event object
   * @param {boolean} value if value is truthy, calls `e.preventDefault` method
   * @returns {boolean} if no value is provided returns `e.defaultPrevented`.
   */
  function ePrevent(e, value) {
    if (value === undefined)
      return e.defaultPrevented || (e.detail.sourceEvent && e.detail.sourceEvent.defaultPrevented);
    else if (value && e && e.preventDefault)
      e.preventDefault();
    }

  /**
   * Convenience method for stopping propagation of DOM event object.
   *
   * @method eStop
   * @param {object} e DOM event object
   * @returns {object} same event object that was fed as a parameter
   */
  function eStop(e) {
    e && e.stopPropagation && e.stopPropagation();
    return e;
  }

  /**
   * A class to create timer objects.
   * @class Timer
   *
   * @constructor
   *
   * @param {function} callback
   * @param {number} [delay] if not specified, timer will not start.
   */

  var Timer = function(callback, delay) {
    var _timeoutID,
      timer = {
        delay:delay,
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
      refresh: refresh,
    });
  };

  // export

  return {Timer: Timer, ePrevent: ePrevent, eStop: eStop};

}());
