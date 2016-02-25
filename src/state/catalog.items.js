'use strict';

import {AT} from './actions'


// ***
// *** appState.catalog.items reducer
// ***

export const items = (state=[], action) => {
  switch (action.type) {

    case AT.catalogItemsDefined:
      return action.items

    default:
      return state
  }
}
