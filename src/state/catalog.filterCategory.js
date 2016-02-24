'use strict';

import * as AT from './actionTypes'

// ***
// *** appState.catalog.filterCategory reducer
// ***

export const filterCategory = (filterCategory="", action) => {
  switch (action.type) {

    case AT.FILTER_CATALOG_CATEGORY:
      return action.category

    default:
      return filterCategory
  }
}
