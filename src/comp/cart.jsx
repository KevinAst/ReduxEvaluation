'use strict';

import React from 'react';
import MyReactComponent from '../util/my-react-component';
import ItemRow from './item-row'; // KJB: hmmmm we re-use our ItemRow component
import { formatMoney } from 'accounting';
import { totalItems, unitPrice } from '../util/money';
import Esc from '../util/esc';

class Cart extends MyReactComponent {

  componentDidMount() {
    Esc.regEscHandler(this.props.closeFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeFn);
  }

  render() {
    const { cartItems, closeFn, checkoutFn, removeItemFn, changeQtyFn } = this.props;

    return (
      <div className="modal cart">
    
        <button className="continue"
                onClick={closeFn}>Continue shopping</button>
    
        <button className="checkout"
                onClick={e => checkoutFn(totalItems(cartItems), e)}
                disabled={totalItems(cartItems) <= 0}>Checkout</button>
    
        <h1>Cart</h1>
        <ul>
          { cartItems.map(cartItem =>
            <ItemRow key={cartItem.id}
                     item={cartItem} >
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
                   onClick={e => {if (cartItem.qty>0) changeQtyFn(cartItem, cartItem.qty-1)}}></i>
              </span>
    
              <button className="remove" onClick={e => removeItemFn(cartItem, e)} >Remove</button>
    
              <span className="lineTotal">
                { formatMoney(unitPrice(cartItem.price, cartItem.qty)) }
              </span>
            </ItemRow> ) }
        </ul>
        <div className="total">Total:
          <span className="formattedTotal">{ formatMoney(totalItems(cartItems)) }</span>
        </div>
      </div>
    );
  }
}

export default Cart;
