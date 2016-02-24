'use strict';

import * as AT             from './actionTypes'
import { combineReducers } from 'redux'
import { items }           from './catalog.items'
import { filterCategory }  from './catalog.filterCategory'
import { expandedItemId }  from './catalog.expandedItemId'


// ***
// *** appState.catalog reducer
// ***

export const catalog = combineReducers({
  items,
  filterCategory,
  expandedItemId,
})
