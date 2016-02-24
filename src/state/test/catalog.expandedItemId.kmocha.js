'use strict';

import { expect }         from '../../util/karma-setup';
import { expandedItemId } from '../catalog.expandedItemId'
import * as AC            from '../actionCreators'


// ***
// *** appState.catalog.expandedItemId reducer tests
// ***

describe('appState.catalog.expandedItemId reducer tests', () => {

  it('should handle initial state', () => {
    expect(expandedItemId(undefined, {}))
          .toEqual(null)
  })

  it('handle toggle AC.toggleItemDetail() Action', () => {

    const item1 = {id:1}
    const item2 = {id:2}

    const curState  = item1.id;
    const nextState = expandedItemId(curState, 
                                     AC.toggleItemDetail(item1))
    const expectedState = null

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  it('handle expand new AC.toggleItemDetail() Action', () => {

    const item1 = {id:1}
    const item2 = {id:2}

    // transition expansion from item1 to item2
    const curState  = item1.id;
    const nextState = expandedItemId(curState, 
                                     AC.toggleItemDetail(item2))
    const expectedState = item2.id

    expect(nextState)
          .toEqual(expectedState)
          .toNotBe(curState) // immutable
  })

  // NOTE: No longer needed, because our retrofit of alternate usage of ItemRow will ignore expansion
  //       The nice thing about leaving this alone, is prior <Catalog> expansion is retained when <Cart> dialog is closed
//it('handle collapse for AC.buyItem() Action', () => {
//
//  const item1 = {id:1}
//  const item2 = {id:2}
//
//  // transition expansion when buying any item
//  const curState  = item1;
//  const nextState = expandedItemId(curState, 
//                                   AC.buyItem(item2))
//  const expectedState = null
//
//  expect(nextState)
//        .toEqual(expectedState)
//        .toNotBe(curState) // immutable
//})

  it('should ignore unrelated Actions', () => {

    const curState  = {id:1};
    const nextState = expandedItemId(curState, 
                                     { type: 'URELATED_ACTION'})
    const expectedState = curState

    expect(nextState)
          .toExist()
          .toEqual(expectedState)
          .toBe(curState) // immutable (however because unrelated, should BE the same ref)
  })

})
