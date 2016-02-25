'use strict';

import {AT} from './actions'


// ***
// *** appState.checkout.total reducer
// ***

export const total = (total=0, action) => {
  switch (action.type) {

    case AT.checkout:
      return action.total

    case AT.saleComplete:
      return null

    default:
      return total
  }
}
