'use strict'

import {AT} from './actions'


// ***
// *** appState.checkout.fields reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  [AT.closeCheckout](fields, action) {
    return Object.assign({}, fields, {
             creditCard: null, // clear sensitive data
             cvcode:     null, // clear sensitive data
           })
  },

  [AT.saleComplete](fields, action) {
    return Object.assign({}, fields, {
             creditCard: null, // clear sensitive data
             cvcode:     null, // clear sensitive data
           })
  },

  [AT.setCheckoutField](fields, action) {
    return Object.assign({}, fields, {
             [action.name]: action.value
           })
  },

}

export function fields(fields={}, action) {
  const  reducer = reducers[action.type]
  return reducer ? reducer(fields, action) : fields
}
