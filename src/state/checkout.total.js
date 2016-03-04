'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


// ***
// *** appState.checkout.total reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.checkout](total, action) {
    return action.total
  },

  [AT.saleComplete](total, action) {
    return null
  },

}

export function total(total=0, action) {
  return ReduxUtil.resolveReducer(reducers, total, action)
}
