'use strict';

import shortid   from 'shortid';
import * as AT   from './actionTypes'


// ***
// *** all action creators ...
// ***

export const buyItem = (item) => {
  return {
    type: AT.BUY_ITEM,
    item,
  }
}

export const catalogItemsDefined = (items) => {
  return {
    type: AT.CATALOG_ITEMS_DEFINED,
    items,
  }
}

export const checkout = (total) => {
  return {
    type: AT.CHECKOUT,
    total,
  }
}

export const closeCart = () => {
  return {
    type: AT.CLOSE_CART,
  }
}

export const closeCheckout = () => {
  return {
    type: AT.CLOSE_CHECKOUT,
  }
}

export const closeReceipt = () => {
  return {
    type: AT.CLOSE_RECEIPT,
  }
}

export const filterCatalogCategory = (category) => { // null for all
  return {
    type: AT.FILTER_CATALOG_CATEGORY,
    category,
  }
}

export const openCart = () => {
  return {
    type: AT.OPEN_CART,
  }
}

export const removeCartItem = (cartItem) => {
  return {
    type: AT.REMOVE_CART_ITEM,
    cartItem,
  }
}

export const saleComplete = (cartItems) => {
  return {
    type:         AT.SALE_COMPLETE,
    receiptId:    shortid.generate(),
    receiptItems: cartItems,
  }
}

export const setCartItemQty = (cartItem, qty) => {
  return {
    type: AT.SET_CART_ITEM_QTY,
    cartItem,
    qty,
  }
}

export const setCheckoutField = (name, value) => {
  return {
    type: AT.SET_CHECKOUT_FIELD,
    name,
    value,
  }
}

export const toggleItemDetail = (item) => {
  return {
    type: AT.TOGGLE_ITEM_DETAIL,
    item,
  }
}
