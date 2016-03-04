'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


// ***
// *** appState.checkout.visible reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  [AT.checkout]      (visible, action) { return true  },
  [AT.closeCheckout] (visible, action) { return false },
  [AT.saleComplete]  (visible, action) { return false },
}

export function visible(visible=false, action) {
  return ReduxUtil.resolveReducer(reducers, visible, action)
}
