'use strict';

import { expect } from '../../util/karma-setup';
import * as AT from '../actionTypes'
import * as AC from '../actionCreators'

// ***
// *** all actionCreators tests ...
// ***

describe('actionCreators tests', () => {

  it('test buyItem()', () => {
    expect(AC.buyItem("MyItem"))
          .toEqual({
              type: AT.BUY_ITEM,
              item: "MyItem",
          })
  })

  it('test catalogItemsDefined()', () => {
    expect(AC.catalogItemsDefined([1,2,3]))
          .toEqual({
              type: AT.CATALOG_ITEMS_DEFINED,
              items: [1,2,3]
          })
  })

  it('test checkout()', () => {
    expect(AC.checkout(123))
          .toEqual({
              type:  AT.CHECKOUT,
              total: 123
          })
  })

  it('test closeCart()', () => {
    expect(AC.closeCart())
          .toEqual({
              type: AT.CLOSE_CART,
          })
  })

  it('test closeCheckout()', () => {
    expect(AC.closeCheckout())
          .toEqual({
              type: AT.CLOSE_CHECKOUT,
          })
  })

  it('test closeReceipt()', () => {
    expect(AC.closeReceipt())
          .toEqual({
              type: AT.CLOSE_RECEIPT,
          })
  })

  it('test filterCatalogCategory()', () => {
    expect(AC.filterCatalogCategory("MyCategory"))
          .toEqual({
              type:     AT.FILTER_CATALOG_CATEGORY,
              category: "MyCategory"
          })
  })

  it('test openCart()', () => {
    expect(AC.openCart())
          .toEqual({
              type: AT.OPEN_CART,
          })
  })

  it('test removeCartItem()', () => {
    expect(AC.removeCartItem("MyItem"))
          .toEqual({
              type:     AT.REMOVE_CART_ITEM,
              cartItem: "MyItem",
          })
  })

  it('test setCartItemQty()', () => {
    expect(AC.setCartItemQty("MyItem", 55))
          .toEqual({
              type:     AT.SET_CART_ITEM_QTY,
              cartItem: "MyItem",
              qty:      55
          })
  })

  it('test setCheckoutField()', () => {
    expect(AC.setCheckoutField("MyName", "MyValue"))
          .toEqual({
              type:  AT.SET_CHECKOUT_FIELD,
              name:  "MyName",
              value: "MyValue"
          })
  })

  it('test toggleItemDetail()', () => {
    expect(AC.toggleItemDetail("MyItem"))
          .toEqual({
              type: AT.TOGGLE_ITEM_DETAIL,
              item: "MyItem"
          })
  })

})
