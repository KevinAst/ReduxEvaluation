'use strict'

import {AT} from './actions'


// ***
// *** appState.catalog.expandedItemId reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.toggleItemDetail](expandedItemId, action) {
    // toggle expandedItemId (when already expanded -and- same item targeted in action)
    // otherwise expand targeted item in action
    return expandedItemId!==null && expandedItemId===action.item.id ? null : action.item.id
  },

  // NOTE: No longer needed, because our retrofit of alternate usage of ItemRow will ignore expansion
  //       The nice thing about leaving this alone, is prior <Catalog> expansion is retained when <Cart> dialog is closed
  // [AT.buyItem](expandedItemId, action) {
  //   return null  // implicitly contract the details when when we buy the item
  // },

}

export function expandedItemId(expandedItemId=null, action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(expandedItemId, action) : expandedItemId
}
