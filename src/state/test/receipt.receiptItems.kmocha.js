'use strict'

import { expect }        from '../../util/karma-setup'
import { receiptItems }  from '../receipt.receiptItems'
import * as AC           from '../actionCreators'


// ***
// *** appState.receipt.receiptItems reducer tests
// ***

describe('appState.receipt.receiptItems reducer tests', () => {

  it('should handle initial state', () => {
    expect(receiptItems(undefined, {}))
          .toEqual([])
  })

  it('handle AC.saleComplete() Action', () => {

    const curState      = [4,5,6]
    const nextState     = receiptItems(curState, 
                                       AC.saleComplete([1,2,3]))
    const expectedState = [1,2,3]

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.closeReceipt() Action', () => {

    const curState      = [4,5,6]
    const nextState     = receiptItems(curState, 
                                       AC.closeReceipt())
    const expectedState = []

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState      = [4,5,6]
    const nextState     = receiptItems(curState, 
                                       { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
