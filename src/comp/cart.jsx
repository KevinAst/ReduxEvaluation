'use strict'

import React                     from 'react'
import ReduxUtil                 from '../util/redux-util'
import MyReactComponent          from '../util/my-react-component'
import Items                     from './items'
import { formatMoney }           from 'accounting'
import { totalItems, unitPrice } from '../util/money'
import Esc                       from '../util/esc'
import {AC}                      from '../state/actions'


// ***
// *** Cart component (a Shopping Cart)
// ***

const Cart = ReduxUtil.wrapCompWithInjectedProps(

  class extends MyReactComponent { // component definition

    componentDidMount() {
      Esc.regEscHandler(this.props.closeCartFn)
    }
    
    componentWillUnmount() {
      Esc.unregEscHandler(this.props.closeCartFn)
    }
    
    render() {
      const { cartItems, closeCartFn, changeQtyFn, removeItemFn, checkoutFn } = this.props
    
      const additionalContentPerItemFn = (cartItem) => {
        return <span>
                 <span className="qty">
                   Quantity:
                   <input name="qty"
                          value={cartItem.qty}
                          onChange={e => changeQtyFn(cartItem, parseInt(e.target.value, 10) || 0)} />
                 </span>
    
                 <span style={{display:       "inline-flex",
                               flexDirection: "column",
                               fontSize:      '75%',
                               fontWeight:    'bold',
                               cursor:        'pointer'}}>
                   <i className="fa fa-angle-double-up"
                      title="increase quantity"
                      onClick={e => changeQtyFn(cartItem, cartItem.qty+1)}></i>
                   <i className="fa fa-angle-double-down"
                      title="decrease quantity"
                      onClick={e => changeQtyFn(cartItem, cartItem.qty-1)}></i>
                 </span>
                 
                 <button className="remove" onClick={e => removeItemFn(cartItem)} >Remove</button>
                 
                 <span className="lineTotal">
                   { formatMoney(unitPrice(cartItem.price, cartItem.qty)) }
                 </span>
               </span>
      }
    
      return <div className="modal cart">
               
               <button className="continue"
                       onClick={closeCartFn}>Continue shopping</button>
               
               <button className="checkout"
                       onClick={e => checkoutFn(totalItems(cartItems))}
                       disabled={totalItems(cartItems) <= 0}>Checkout</button>
               
               <h1>Cart</h1>
               <Items items={cartItems}
                      additionalContentPerItemFn={additionalContentPerItemFn}/>
    
               <div className="total">Total:
                 <span className="formattedTotal">{ formatMoney(totalItems(cartItems)) }</span>
               </div>
             </div>
    }

  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        cartItems: appState.cart.cartItems,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeCartFn:  ()              =>  { dispatch( AC.closeCart() ) },
        changeQtyFn:  (cartItem, qty) =>  { if (qty>=0) dispatch( AC.setCartItemQty(cartItem, qty) ) },
        removeItemFn: (cartItem)      =>  { dispatch( AC.removeCartItem(cartItem) ) },
        checkoutFn:   (total)         =>  { dispatch( AC.checkout(total) ) },
      }
    }
  }) // end of ... component property injection

// define expected props
Cart.propTypes = {
}

export default Cart
