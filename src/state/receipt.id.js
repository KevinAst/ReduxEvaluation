'use strict'

import {AT} from './actions'


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
  const  reducer = reducers[action.type]
  return reducer ? reducer(id, action) : id
}
