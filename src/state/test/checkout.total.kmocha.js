'use strict'

import { expect }  from '../../util/karma-setup'
import { total }   from '../checkout.total'
import * as AC     from '../actionCreators'


// ***
// *** appState.checkout.total reducer tests
// ***

describe('appState.checkout.total reducer tests', () => {

  it('should handle initial state', () => {
    expect(total(undefined, {}))
          .toEqual(0)
  })

  it('handle AC.checkout() Action', () => {

    const curState      = 123
    const nextState     = total(curState, 
                                AC.checkout(456))
    const expectedState = 456

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle AC.saleComplete() Action', () => {
    const curState  = 55
    const nextState = total(curState, 
                            AC.saleComplete([1,2,3]))
    const expectedState = null

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState      = 789
    const nextState     = total(curState, 
                                { type: 'URELATED_ACTION'})
    const expectedState = 789

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
