'use strict'

import {AT} from './actions'


// ***
// *** appState.catalog.items reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.catalogItemsDefined](items, action) {
    return action.items
  },

}

export function items(items=[], action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(items, action) : items
}
