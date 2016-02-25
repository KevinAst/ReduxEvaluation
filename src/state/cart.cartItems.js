'use strict'

import {AT} from './actions'


// ***
// *** appState.cart.cartItems reducer
// ***

export const cartItems = (cartItems=[], action) => {
  switch (action.type) {

    case AT.buyItem:
        
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



    case AT.setCartItemQty:

      return cartItems.map( (cartItem) => {
        if (action.cartItem.id === cartItem.id) {
          return Object.assign({}, cartItem, {qty: action.qty}) // new instance (because are immutable) with qty adjustment
        }
        return cartItem // pass through other cartItems unchanged
      })



    case AT.removeCartItem:

      return cartItems.filter( (cartItem) => action.cartItem.id !== cartItem.id )



    case AT.saleComplete:

      return []



    default:
      return cartItems
  }
}
