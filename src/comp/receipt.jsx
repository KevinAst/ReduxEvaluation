'use strict';

import React                     from 'react';
import ReduxUtil                 from '../util/redux-util'
import MyReactComponent          from '../util/my-react-component';
import ItemRow                   from './item-row';
import { totalItems, unitPrice } from '../util/money';
import { formatMoney }           from 'accounting';
import Esc                       from '../util/esc';
import * as AC                   from '../state/actionCreators'


// ***
// *** Receipt component
// ***

// our internal Receipt$ class (wrapped with Receipt below)
class Receipt$ extends MyReactComponent {

  componentDidMount() {
    Esc.regEscHandler(this.props.closeReceiptFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeReceiptFn);
  }

  render() {
    const { receiptItems, receiptId, closeReceiptFn } = this.props;

    return (
      <div className="modal receipt">
        <button className="close" onClick={closeReceiptFn}>Close</button>
        <h1>Receipt</h1>
        <div className="receiptNumber">
          Receipt#: <span className="receiptId">{ receiptId }</span>
        </div>
        <ul>
          { receiptItems.map(receiptItem =>
            <ItemRow key={receiptItem.id}
                     item={receiptItem} >
              <span className="qty">Quantity:
                <span className="qtyValue">{ receiptItem.qty }</span>
              </span>
              <span className="lineTotal">
                { formatMoney(unitPrice(receiptItem.price, receiptItem.qty)) }
              </span>
            </ItemRow> ) }
        </ul>
        <div className="total">Total:
          <span className="formattedTotal">{ formatMoney(totalItems(receiptItems)) }</span>
        </div>
      </div>
    );
  }
}


//***
//*** wrap our internal Receipt$ class with a public Receipt class
//*** that injects properties (both data and behavior) from our state.
//***

const Receipt = ReduxUtil.wrapCompWithInjectedProps(Receipt$, {
                  mapStateToProps: (appState, ownProps) => {
                    return {
                      receiptItems: appState.receipt.receiptItems,
                      receiptId:    appState.receipt.id,
                    }
                  },
                  mapDispatchToProps: (dispatch, ownProps) => {
                    return {
                      closeReceiptFn: (e) =>  { dispatch( AC.closeReceipt() ) },
                    }
                  }
                });

// define expected props
Receipt.propTypes = {
}

export default Receipt;
