'use strict'

import { combineReducers } from 'redux'
import { visible }         from './cart.visible'
import { cartItems }       from './cart.cartItems'


// ***
// *** appState.cart reducer
// ***

export const cart = combineReducers({
  visible,
  cartItems,
})
