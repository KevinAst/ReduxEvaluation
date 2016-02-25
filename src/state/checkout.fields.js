'use strict';

import {AT} from './actions'


// ***
// *** appState.checkout.fields reducer
// ***

export const fields = (fields={}, action) => {
  switch (action.type) {

    case AT.closeCheckout:
    case AT.saleComplete:
      return Object.assign({}, fields, {
               creditCard: null, // clear sensitive data
               cvcode:     null, // clear sensitive data
             });

    case AT.setCheckoutField:
      return Object.assign({}, fields, {
               [action.name]: action.value
             });

    default:
      return fields
  }
}
