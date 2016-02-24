'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.receipt.id reducer
// ***

export const id = (id=null, action) => {
  switch (action.type) {

    case AT.SALE_COMPLETE:
      return action.receiptId

    case AT.CLOSE_RECEIPT:
      return null

    default:
      return id
  }
}
