'use strict';

import {AT} from './actions'

// ***
// *** appState.catalog.filterCategory reducer
// ***

export const filterCategory = (filterCategory="", action) => {
  switch (action.type) {

    case AT.filterCatalogCategory:
      return action.category

    default:
      return filterCategory
  }
}
