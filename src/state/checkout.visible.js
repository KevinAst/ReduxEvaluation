'use strict';

import {AT} from './actions'


// ***
// *** appState.checkout.visible reducer
// ***

export const visible = (visible=false, action) => {
  switch (action.type) {

    case AT.checkout:
      return true

    case AT.closeCheckout:
      return false

    case AT.saleComplete:
      return false

    default:
      return visible
  }
}
