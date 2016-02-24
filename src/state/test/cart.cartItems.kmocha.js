'use strict'

import { expect }    from '../../util/karma-setup'
import { cartItems } from '../cart.cartItems'
import * as AC       from '../actionCreators'


// ***
// *** appState.cart.cartItems reducer tests
// ***

describe('appState.cart.cartItems reducer tests', () => {

  it('should handle initial state', () => {
    expect(cartItems(undefined, {}))
          .toEqual([])
  })

  it('handle NEW AC.buyItem() Action', () => {
    const item56        = { id: 56 }
    const curState      = []
    const nextState     = cartItems(curState, 
                                    AC.buyItem(item56))
    const expectedState = [ { id: 56, qty: 1 }]

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle EXISTING AC.buyItem() Action', () => {
    const item56        = { id: 56 }
    const curState      = [ { id: 56, qty: 3 }]
    const nextState     = cartItems(curState, 
                                    AC.buyItem(item56))
    const expectedState = [ { id: 56, qty: 4 }]

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.setCartItemQty() Action', () => {
    const item5     = { id: 5, qty: 5 }
    const item6     = { id: 6, qty: 6 }
    const item6$    = { id: 6, qty: 66}
    const item7     = { id: 7, qty: 7 }
    const curState  = [item5, item6, item7]
    const nextState = cartItems(curState, 
                                AC.setCartItemQty(item6, 66))
    const expectedState = [ item5, item6$, item7]

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.removeCartItemQty() Action', () => {
    const item5     = { id: 5, qty: 5 }
    const item6     = { id: 6, qty: 6 }
    const item7     = { id: 7, qty: 7 }
    const curState  = [item5, item6, item7]
    const nextState = cartItems(curState, 
                                AC.removeCartItem(item6))
    const expectedState = [ item5, item7]

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.saleComplete() Action', () => {
    const curState  = [4,5,6]
    const nextState = cartItems(curState, 
                                AC.saleComplete([1,2,3]))
    const expectedState = []

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {
    const curState      = [ { id: 56, qty: 1 }]
    const nextState     = cartItems(curState, 
                                    { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
