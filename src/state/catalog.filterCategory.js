'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'

// ***
// *** appState.catalog.filterCategory reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.filterCatalogCategory](filterCategory, action) {
    return action.category
  },

}

export function filterCategory(filterCategory="", action) {
  return ReduxUtil.resolveReducer(reducers, filterCategory, action)
}
