'use strict';

import * as AT             from './actionTypes'
import { combineReducers } from 'redux'
import { visible }         from './checkout.visible'
import { total }           from './checkout.total'
import { fields }          from './checkout.fields'


// ***
// *** appState.checkout reducer
// ***

export const checkout = combineReducers({
  visible,
  total,
  fields,
})
