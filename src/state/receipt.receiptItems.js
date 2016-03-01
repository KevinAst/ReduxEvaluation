'use strict'

import {AT} from './actions'


// ***
// *** appState.receipt.receiptItems reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.saleComplete](receiptItems, action) {
    return action.receiptItems
  },

  [AT.closeReceipt](receiptItems, action) {
    return []
  },

}

export function receiptItems(receiptItems=[], action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(receiptItems, action) : receiptItems
}
