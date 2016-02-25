'use strict';

import {AT} from './actions'


// ***
// *** appState.receipt.receiptItems reducer
// ***

export const receiptItems = (receiptItems=[], action) => {
  switch (action.type) {

    case AT.saleComplete:
      return action.receiptItems

    case AT.closeReceipt:
      return []

    default:
      return receiptItems
  }
}
