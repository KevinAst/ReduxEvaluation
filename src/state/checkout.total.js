'use strict'

import {AT} from './actions'


// ***
// *** appState.checkout.total reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.checkout](total, action) {
    return action.total
  },

  [AT.saleComplete](total, action) {
    return null
  },

}

export function total(total=0, action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(total, action) : total
}
