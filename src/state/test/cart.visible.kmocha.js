'use strict'

import { expect }  from '../../util/karma-setup'
import { visible } from '../cart.visible'
import * as AC     from '../actionCreators'


// ***
// *** appState.cart.visible reducer tests
// ***

describe('appState.cart.visible reducer tests', () => {

  it('should handle initial state', () => {
    expect(visible(undefined, {}))
          .toEqual(false)
  })

  it('handle AC.openCart() Action', () => {

    const curState      = false
    const nextState     = visible(curState, 
                                  AC.openCart())
    const expectedState = true

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.closeCart() Action', () => {

    const curState      = true
    const nextState     = visible(curState, 
                                  AC.closeCart())
    const expectedState = false

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.buyItem() Action', () => {

    const curState      = false
    const nextState     = visible(curState, 
                                  AC.buyItem("MyItem"))
    const expectedState = true

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.saleComplete() Action', () => {

    const curState      = true
    const nextState     = visible(curState, 
                                  AC.saleComplete([1,2,3]))
    const expectedState = false

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState      = true
    const nextState     = visible(curState, 
                                  { type: 'URELATED_ACTION'})
    const expectedState = true

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
