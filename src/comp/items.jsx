'use strict'

import React           from 'react'
import ReduxUtil       from '../util/redux-util'
import { PropTypes }   from 'react'
import ItemRow         from './item-row'


// ***
// *** Items component
// ***

// our internal Items$ class (wrapped with Items below)
const Items$ = ({items, className, allowDetails, allowBuy, additionalContentPerItemFn}) => {
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
}


//***
//*** wrap our internal Items$ class with a public Items class
//*** that injects properties (both data and behavior) from our state.
//***

const Items = ReduxUtil.wrapCompWithInjectedProps(Items$, {
  mapStateToProps(appState, ownProps) {
    return {
    }
  },
  mapDispatchToProps(dispatch, ownProps) {
    return {
    }
  }
})

// define expected props
Items.propTypes = {
  items:        PropTypes.array.isRequired,
  className:    PropTypes.string,
  allowDetails: PropTypes.bool,
  allowBuy:     PropTypes.bool,
  additionalContentPerItemFn: PropTypes.func,
}

export default Items
