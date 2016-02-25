'use strict';

import {AT} from './actions'


// ***
// *** appState.catalog.expandedItemId reducer
// ***

export const expandedItemId = (expandedItemId=null, action) => {
  switch (action.type) {

    case AT.toggleItemDetail:
      // toggle expandedItemId (when already expanded -and- same item targeted in action)
      // otherwise expand targeted item in action
      return expandedItemId!==null && expandedItemId===action.item.id ? null : action.item.id

    // NOTE: No longer needed, because our retrofit of alternate usage of ItemRow will ignore expansion
    //       The nice thing about leaving this alone, is prior <Catalog> expansion is retained when <Cart> dialog is closed
 // case AT.buyItem:
 //   return null  // implicitly contract the details when when we buy the item

    default:
      return expandedItemId
  }
}
