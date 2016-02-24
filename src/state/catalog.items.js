'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.catalog.items reducer
// ***

export const items = (state=[], action) => {
  switch (action.type) {

    case AT.CATALOG_ITEMS_DEFINED:
      return action.items

    default:
      return state
  }
}
