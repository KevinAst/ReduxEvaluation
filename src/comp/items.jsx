'use strict'

import React           from 'react'
import ReduxUtil       from '../util/redux-util'
import { PropTypes }   from 'react'
import ItemRow         from './item-row'


// ***
// *** Items component
// ***


const Items = ReduxUtil.wrapCompWithInjectedProps(

  function({items, className, allowDetails, allowBuy, additionalContentPerItemFn}) { // component definition (functional)

    return <ul className={className}>
             { items.map(item => (
                 <ItemRow key={item.id}
                          item={item}
                          allowDetails={allowDetails}
                          allowBuy={allowBuy}>
                   { additionalContentPerItemFn && additionalContentPerItemFn(item) }
                 </ItemRow>
               ))
             }
           </ul>

  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
      }
    }
  }) // end of ... component property injection

// define expected props
Items.propTypes = {
  items:        PropTypes.array.isRequired,
  className:    PropTypes.string,
  allowDetails: PropTypes.bool,
  allowBuy:     PropTypes.bool,
  additionalContentPerItemFn: PropTypes.func,
}

export default Items
