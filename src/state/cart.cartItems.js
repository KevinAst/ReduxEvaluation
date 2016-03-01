'use strict'

import {AT} from './actions'


// ***
// *** appState.cart.cartItems reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.buyItem](cartItems, action) {
    // clone cartItems array, processing entry when it previously existed
    let itemExistsInCart = false
    const _cartItems = cartItems.map( (cartItem) => {
      if (action.item.id === cartItem.id) {
        itemExistsInCart = true
        return Object.assign({}, cartItem, {qty: cartItem.qty+1}) // new instance (because are immutable) with qty incremented
      }
      return cartItem // pass through other cartItems unchanged
    })
  
    // when item is new to cart, inject a new cartItem at end
    if (!itemExistsInCart) {
      _cartItems.push( Object.assign({}, action.item, {qty: 1}) ) // NOTE: we morph a regular item into a cartItem here <KEY>!
    }
      
    return _cartItems
  },

  [AT.setCartItemQty](cartItems, action) {
    return cartItems.map( (cartItem) => {
      if (action.cartItem.id === cartItem.id) {
        return Object.assign({}, cartItem, {qty: action.qty}) // new instance (because are immutable) with qty adjustment
      }
      return cartItem // pass through other cartItems unchanged
    })
  },

  [AT.removeCartItem](cartItems, action) {
    return cartItems.filter( (cartItem) => action.cartItem.id !== cartItem.id )
  },

  [AT.saleComplete](cartItems, action) {
    return []
  },

}

export function cartItems(cartItems=[], action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(cartItems, action) : cartItems
}
