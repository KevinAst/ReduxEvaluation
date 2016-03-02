'use strict'

import {AT} from './actions'

// ***
// *** appState.catalog.filterCategory reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.filterCatalogCategory](filterCategory, action) {
    return action.category
  },

}

export function filterCategory(filterCategory="", action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(filterCategory, action) : filterCategory
}
