'use strict'

import { expect }  from '../../util/karma-setup'
import { id }      from '../receipt.id'
import * as AC     from '../actionCreators'


// ***
// *** appState.receipt.id reducer tests
// ***

describe('appState.receipt.id reducer tests', () => {

  it('should handle initial state', () => {
    expect(id(undefined, {}))
          .toEqual(null)
  })

  it('handle AC.saleComplete() Action', () => {

    const curState      = null
    const nextState     = id(curState, 
                             AC.saleComplete([1,2,3]))
    const expectedState = "A-Generated-ID"

    expect(nextState)
        //.toEqual(expectedState) // NOTE: this is a generated receiptId ... we just punt and check for existance
          .toExist()
          .toNotBe(curState) // immutable
  })

  it('handle AC.closeReceipt() Action', () => {

    const curState      = "ReceiptId"
    const nextState     = id(curState, 
                             AC.closeReceipt())
    const expectedState = null

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState      = "MyId"
    const nextState     = id(curState, 
                             { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
