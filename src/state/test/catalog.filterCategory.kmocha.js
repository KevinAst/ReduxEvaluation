'use strict';

import { expect }         from '../../util/karma-setup';
import { filterCategory } from '../catalog.filterCategory'
import * as AC            from '../actionCreators'


// ***
// *** appState.catalog.filterCategory reducer tests
// ***

describe('appState.catalog.filterCategory reducer tests', () => {

  it('should handle initial state', () => {
    expect(filterCategory(undefined, {}))
          .toEqual("")
  })

  it('handle toggle AC.filterCatalogCategory() Action', () => {

    const item1 = {id:1}
    const item2 = {id:2}

    const curState  = "Wow"
    const nextState = filterCategory(curState, 
                                     AC.filterCatalogCategory("Zee"))
    const expectedState = null

    expect(nextState)
          .toEqual("Zee")
          .toNotBe(curState) // immutable
  })

  it('should ignore unrelated Actions', () => {

    const curState  = "Hmmm";
    const nextState = filterCategory(curState, 
                                     { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
