'use strict'

import {AT} from './actions'


// ***
// *** appState.checkout.visible reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  [AT.checkout]      (visible, action) { return true  },
  [AT.closeCheckout] (visible, action) { return false },
  [AT.saleComplete]  (visible, action) { return false },
}

export function visible(visible=false, action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(visible, action) : visible
}
