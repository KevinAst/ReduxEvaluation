'use strict'

import {expect} from '../../util/karma-setup'
import {AT, AC} from '../actions'


// ***
// *** all actionCreators tests ...
// ***

describe('actionCreators tests', () => {

  it('test buyItem()', () => {
    expect(AC.buyItem("MyItem"))
          .toEqual({
              type: AT.buyItem,
              item: "MyItem",
          })
  })

  it('test catalogItemsDefined()', () => {
    expect(AC.catalogItemsDefined([1,2,3]))
          .toEqual({
              type: AT.catalogItemsDefined,
              items: [1,2,3]
          })
  })

  it('test checkout()', () => {
    expect(AC.checkout(123))
          .toEqual({
              type:  AT.checkout,
              total: 123
          })
  })

  it('test closeCart()', () => {
    expect(AC.closeCart())
          .toEqual({
              type: AT.closeCart,
          })
  })

  it('test closeCheckout()', () => {
    expect(AC.closeCheckout())
          .toEqual({
              type: AT.closeCheckout,
          })
  })

  it('test closeReceipt()', () => {
    expect(AC.closeReceipt())
          .toEqual({
              type: AT.closeReceipt,
          })
  })

  it('test filterCatalogCategory()', () => {
    expect(AC.filterCatalogCategory("MyCategory"))
          .toEqual({
              type:     AT.filterCatalogCategory,
              category: "MyCategory"
          })
  })

  it('test openCart()', () => {
    expect(AC.openCart())
          .toEqual({
              type: AT.openCart,
          })
  })

  it('test removeCartItem()', () => {
    expect(AC.removeCartItem("MyItem"))
          .toEqual({
              type:     AT.removeCartItem,
              cartItem: "MyItem",
          })
  })

  it('test setCartItemQty()', () => {
    expect(AC.setCartItemQty("MyItem", 55))
          .toEqual({
              type:     AT.setCartItemQty,
              cartItem: "MyItem",
              qty:      55
          })
  })

  it('test setCheckoutField()', () => {
    expect(AC.setCheckoutField("MyName", "MyValue"))
          .toEqual({
              type:  AT.setCheckoutField,
              name:  "MyName",
              value: "MyValue"
          })
  })

  it('test toggleItemDetail()', () => {
    expect(AC.toggleItemDetail("MyItem"))
          .toEqual({
              type: AT.toggleItemDetail,
              item: "MyItem"
          })
  })

})
