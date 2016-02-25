'use strict';

import {AT} from './actions'


// ***
// *** appState.receipt.id reducer
// ***

export const id = (id=null, action) => {
  switch (action.type) {

    case AT.saleComplete:
      return action.receiptId

    case AT.closeReceipt:
      return null

    default:
      return id
  }
}
