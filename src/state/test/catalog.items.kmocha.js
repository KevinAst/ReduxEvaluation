'use strict';

import { expect } from '../../util/karma-setup';
import { items }  from '../catalog.items'
import * as AC    from '../actionCreators'


// ***
// *** appState.catalog.items reducer tests
// ***

describe('appState.catalog.items reducer tests', () => {

  it('should handle initial state', () => {
    expect(items(undefined, {}))
          .toEqual([])
  })

  it('should handle AC.catalogItemsDefined() Action', () => {

    let curState  = [4,5,6];
    let nextState = items(curState, 
                          AC.catalogItemsDefined([1,2,3]))
    let expectedState = [1,2,3]

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    let curState  = [4,5,6];
    let nextState = items(curState, 
                          { type: 'URELATED_ACTION'})
    let expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
