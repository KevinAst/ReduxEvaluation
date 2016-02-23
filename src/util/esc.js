'use strict';

import { ESC_KEY } from './constants';

/**
 * The Esc class provides a simple handler for Esc Key processing.
 * 
 * Client's can register/unregister their Esc Key handlers.  The most current
 * handler will be invoked when an Esc Key is processed.
 *
 * A central dom-based event handler must invoke the Esc.handleEscKey(event)
 * processor for key presses or key releases.
 * 
 * @author Kevin Bridges
 */
class Esc {

  static regEscHandler(fn) {
    _escKeyHandlers.push(fn);
    // console.log("xxx registering EscKey fn ... now have num elms: " + _escKeyHandlers.length);
  }

  static unregEscHandler(fn) {
    _escKeyHandlers = _escKeyHandlers.filter(x => x !== fn);
    // console.log("xxx unregistering EscKey fn ... now have num elms: " + _escKeyHandlers.length);
  }

  // our master "keydown" event listener
  static handleEscKey(e) {
    // console.log("xxx in handleEscKey()");

    // no-op if key is NOT escape
    if (e.keyCode !== ESC_KEY)
      return;

    // process most recent ESC handler (if any)
    if (_escKeyHandlers.length) {
      e.preventDefault(); // stop event bubbling
      const mostRecentHandler = _escKeyHandlers[_escKeyHandlers.length - 1];
      // console.log("xxx handleEscKey() processing latest handler");
      mostRecentHandler(e);
    }
  }
}

let _escKeyHandlers = []; // our set of esc key handlers <PRIVATE>

export default Esc;
