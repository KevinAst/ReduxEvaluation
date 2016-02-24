'use strict';

import React           from 'react';
import ReduxUtil       from '../util/redux-util'
import { PropTypes }   from 'react'
import { formatMoney } from 'accounting';
import ItemDetails     from './item-details';
import * as AC         from '../state/actionCreators'


// ***
// *** ItemRow component
// ***

// our internal ItemRow$ class (wrapped with ItemRow below)
const ItemRow$ = ({item, allowDetails, allowBuy, expandedItemId, toggleItemDetailFn, buyItemFn, children}) => {

  const genDetails = () => {
    if (!allowDetails)
      return null; // no-op if details are NOT allowed

    if (item.id === expandedItemId)
      return <span>
               <button>
                 Collapse Details
               </button>
               <ItemDetails item={item}/>
             </span>;
    else
      return <span>
               <button>
                 Expand Details
               </button>
             </span>;
  };

  return (
    <li data-id={item.id} onClick={toggleItemDetailFn}>
      <img src={item.img} className="product"/>
      <div className="summary">
        <div className="name">
          { item.name }
        </div>
        <div className="pricing">
          <span   className="price">{ formatMoney(item.price) }</span>
          { allowBuy && <button className="buy" onClick={(e) => {e.stopPropagation(); buyItemFn();}}>Buy</button> }
        </div>
        {genDetails()}
      </div>
      {children && <div className="extra">{children}</div>}
    </li>
  );
}


//***
//*** wrap our internal ItemRow$ class with a public ItemRow class
//*** that injects properties (both data and behavior) from our state.
//***

const ItemRow = ReduxUtil.wrapCompWithInjectedProps(ItemRow$, {
                  mapStateToProps: (appState, ownProps) => {
                    return {
                      expandedItemId: appState.catalog.expandedItemId,
                    }
                  },
                  mapDispatchToProps: (dispatch, ownProps) => {
                    return {
                      toggleItemDetailFn: (e) => { if (ownProps.allowDetails) dispatch(AC.toggleItemDetail(ownProps.item)) },
                      buyItemFn:          (e) => { if (ownProps.allowBuy)     dispatch(AC.buyItem(ownProps.item)) },
                    }
                  }
                });

// define expected props
ItemRow.propTypes = {
  item:         PropTypes.object.isRequired,
  allowDetails: PropTypes.bool,
  allowBuy:     PropTypes.bool,
  children:     PropTypes.node,
}

export default ItemRow;
