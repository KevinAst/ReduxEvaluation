'use strict';

import { combineReducers } from 'redux'
import { id }              from './receipt.id'
import { receiptItems }    from './receipt.receiptItems'


// ***
// *** appState.receipt reducer
// ***

export const receipt = combineReducers({
  id,
  receiptItems,
})
