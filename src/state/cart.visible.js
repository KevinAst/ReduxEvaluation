'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.cart.visible reducer
// ***

export const visible = (visible=false, action) => {
  switch (action.type) {

    case AT.OPEN_CART:
      return true

    case AT.CLOSE_CART:
      return false

    case AT.BUY_ITEM:
      return true     // implicitly show cart when we buy the item

    case AT.SALE_COMPLETE:
      return false

    default:
      return visible
  }
}
