'use strict'

import { expect } from '../../util/karma-setup'
import { fields } from '../checkout.fields'
import * as AC    from '../actionCreators'


// ***
// *** appState.checkout.fields reducer tests
// ***

describe('appState.checkout.fields reducer tests', () => {

  it('should handle initial state', () => {
    expect(fields(undefined, {}))
          .toEqual({})
  })

  it('handle AC.closeCheckout() Action', () => {

    const curState      = { a: 111, creditCard: "123", cvcode: "456", z:999 }
    const expectedState = { a: 111, creditCard: null,  cvcode: null,  z:999 } // clear sensitive data
    const nextState     = fields(curState, 
                                 AC.closeCheckout())

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.saleComplete() Action', () => {

    const curState      = { a: 111, creditCard: "123", cvcode: "456", z:999 }
    const expectedState = { a: 111, creditCard: null,  cvcode: null,  z:999 } // clear sensitive data
    const nextState     = fields(curState, 
                                 AC.saleComplete([1,2,3]))

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.setCheckoutField() Action', () => {

    const curState      = { a: 111, creditCard: "123", cvcode: "456", z:999 }
    const expectedState = { a: 111, creditCard: "999", cvcode: "456", z:999 }
    const nextState     = fields(curState, 
                                 AC.setCheckoutField("creditCard", "999"))

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState      = { a: 111, creditCard: "123", cvcode: "456", z:999 }
    const nextState     = fields(curState, 
                                 { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
