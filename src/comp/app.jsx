'use strict';

import React     from 'react';
import ReduxUtil from '../util/redux-util'
import Catalog   from './catalog';
import Cart      from './cart';
import Checkout  from './checkout';
import Receipt   from './receipt';
import * as AC   from '../state/actionCreators'


// ***
// *** App component (our top-level)
// ***

// our internal App$ class (wrapped with App below)
const App$ = ({cartVisible, checkoutVisible, receiptId, openCartFn}) => {
  return <div>
           <span className="cartButton">
             <a onClick={openCartFn}>Cart</a>
           </span>
           <Catalog/>
           { cartVisible     && <Cart/> }
           { checkoutVisible && <Checkout/> }
           { receiptId       && <Receipt/> }
         </div>
}



//***
//*** wrap our internal App$ class with a public App class
//*** that injects properties (both data and behavior) from our state.
//***

const App = ReduxUtil.wrapCompWithInjectedProps(App$, {
              mapStateToProps: (appState, ownProps) => {
                return {
                  cartVisible:     appState.cart.visible,
                  checkoutVisible: appState.checkout.visible,
                  receiptId:       appState.receipt.id,
                }
              },
              mapDispatchToProps: (dispatch, ownProps) => {
                return {
                  openCartFn: () =>  { dispatch(AC.openCart()) },
                }
              }
            });


// define expected props
App.propTypes = {
}

export default App;
