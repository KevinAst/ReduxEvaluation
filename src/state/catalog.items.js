'use strict'

import {AT}      from './actions'
import ReduxUtil from '../util/redux-util'


// ***
// *** appState.catalog.items reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.catalogItemsDefined](items, action) {
    return action.items
  },

}

export function items(items=[], action) {
  return ReduxUtil.resolveReducer(reducers, items, action)
}
