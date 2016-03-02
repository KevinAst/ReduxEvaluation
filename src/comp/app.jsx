'use strict';

import React     from 'react';
import ReduxUtil from '../util/redux-util'
import Catalog   from './catalog';
import Cart      from './cart';
import Checkout  from './checkout';
import Receipt   from './receipt';
import {AC}      from '../state/actions'


// ***
// *** App component (our top-level)
// ***

const App = ReduxUtil.wrapCompWithInjectedProps(

  function({cartVisible, checkoutVisible, receiptId, openCartFn}) { // component definition (functional)
    return <div>
             <span className="cartButton">
               <a onClick={openCartFn}>Cart</a>
             </span>
             <Catalog/>
             { cartVisible     && <Cart/> }
             { checkoutVisible && <Checkout/> }
             { receiptId       && <Receipt/> }
           </div>
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        cartVisible:     appState.cart.visible,
        checkoutVisible: appState.checkout.visible,
        receiptId:       appState.receipt.id,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        openCartFn: () =>  { dispatch(AC.openCart()) },
      }
    }
  }) // end of ... component property injection

// define expected props
App.propTypes = {
}

export default App;
