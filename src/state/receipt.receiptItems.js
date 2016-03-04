'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


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
  return ReduxUtil.resolveReducer(reducers, receiptItems, action)
}
