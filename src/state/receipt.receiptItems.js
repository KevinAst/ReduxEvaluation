'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.receipt.receiptItems reducer
// ***

export const receiptItems = (receiptItems=[], action) => {
  switch (action.type) {

    case AT.SALE_COMPLETE:
      return action.receiptItems

    case AT.CLOSE_RECEIPT:
      return []

    default:
      return receiptItems
  }
}
