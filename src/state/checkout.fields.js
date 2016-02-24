'use strict';

import * as AT from './actionTypes'


// ***
// *** appState.checkout.fields reducer
// ***

export const fields = (fields={}, action) => {
  switch (action.type) {

    case AT.CLOSE_CHECKOUT:
    case AT.SALE_COMPLETE:
      return Object.assign({}, fields, {
               creditCard: null, // clear sensitive data
               cvcode:     null, // clear sensitive data
             });

    case AT.SET_CHECKOUT_FIELD:
      return Object.assign({}, fields, {
               [action.name]: action.value
             });

    default:
      return fields
  }
}
