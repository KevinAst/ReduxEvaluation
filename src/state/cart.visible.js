'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


// ***
// *** appState.cart.visible reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  [AT.openCart]     (visible, action) { return true  },
  [AT.closeCart]    (visible, action) { return false },
  [AT.buyItem]      (visible, action) { return true  }, // implicitly show cart when we buy the item
  [AT.saleComplete] (visible, action) { return false },
}

export function visible(visible=false, action) {
  return ReduxUtil.resolveReducer(reducers, visible, action)
}
