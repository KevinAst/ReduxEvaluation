'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


// ***
// *** appState.receipt.id reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.saleComplete](id, action) {
    return action.receiptId
  },

  [AT.closeReceipt](id, action) {
    return null
  },

}

export function id(id=null, action) {
  return ReduxUtil.resolveReducer(reducers, id, action)
}
