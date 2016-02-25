'use strict';

import {AT} from './actions'

// ***
// *** appState.cart.visible reducer
// ***

export const visible = (visible=false, action) => {
  switch (action.type) {

    case AT.openCart:
      return true

    case AT.closeCart:
      return false

    case AT.buyItem:
      return true     // implicitly show cart when we buy the item

    case AT.saleComplete:
      return false

    default:
      return visible
  }
}
