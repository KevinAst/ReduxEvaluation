'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.checkout.total reducer
// ***

export const total = (total=0, action) => {
  switch (action.type) {

    case AT.CHECKOUT:
      return action.total

    case AT.SALE_COMPLETE:
      return null

    default:
      return total
  }
}
