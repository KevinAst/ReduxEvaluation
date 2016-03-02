'use strict'

import React                     from 'react'
import ReduxUtil                 from '../util/redux-util'
import MyReactComponent          from '../util/my-react-component'
import Items                     from './items'
import { totalItems, unitPrice } from '../util/money'
import { formatMoney }           from 'accounting'
import Esc                       from '../util/esc'
import {AC}                      from '../state/actions'


// ***
// *** Receipt component
// ***

const Receipt = ReduxUtil.wrapCompWithInjectedProps(

  class extends MyReactComponent { // component definition

    componentDidMount() {
      Esc.regEscHandler(this.props.closeReceiptFn)
    }

    componentWillUnmount() {
      Esc.unregEscHandler(this.props.closeReceiptFn)
    }

    render() {
      const { receiptItems, receiptId, closeReceiptFn } = this.props

      const additionalContentPerItemFn = (receiptItem) => {
        return <span>
          <span className="qty">Quantity:
            <span className="qtyValue">{ receiptItem.qty }</span>
          </span>
          <span className="lineTotal">
            { formatMoney(unitPrice(receiptItem.price, receiptItem.qty)) }
          </span>
        </span>
      }

      return <div className="modal receipt">
          <button className="close" onClick={closeReceiptFn}>Close</button>
          <h1>Receipt</h1>
          <div className="receiptNumber">
            Receipt#: <span className="receiptId">{ receiptId }</span>
          </div>
          <Items items={receiptItems}
                 additionalContentPerItemFn={additionalContentPerItemFn}/>
          <div className="total">Total:
            <span className="formattedTotal">{ formatMoney(totalItems(receiptItems)) }</span>
          </div>
      </div>
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        receiptItems: appState.receipt.receiptItems,
        receiptId:    appState.receipt.id,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeReceiptFn: (e) =>  { dispatch( AC.closeReceipt() ) },
      }
    }
  }) // end of ... component property injection

// define expected props
Receipt.propTypes = {
}

export default Receipt
