'use strict'

import React         from 'react'
import ReduxUtil     from '../util/redux-util'
import { PropTypes } from 'react'
import Items         from './items'
import {AC}          from '../state/actions'


// ***
// *** Catalog of items component
// ***

const Catalog = ReduxUtil.wrapCompWithInjectedProps(

  function({items, filterCategory, changeFilterCategory}) { // component definition (functional)

    const filteredItems = filterCategory ?
                            items.filter(item => item.category === filterCategory) :
                            items
    return <div>
             Category:
             <select onChange={ e => changeFilterCategory(e.target.value)}
                     className="category">
               <option value="">All</option>
               { Catalog.CATEGORIES.map(cat =>
                   <option key={cat}
                           value={cat}>
                     {cat}
                   </option> )
               }
             </select>
             <Items className="product catalog"
                    items={filteredItems}
                    allowBuy={true}
                    allowDetails={true}/>
           </div>
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        items:          appState.catalog.items,
        filterCategory: appState.catalog.filterCategory,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        changeFilterCategory: (category) => { dispatch(AC.filterCatalogCategory(category)) },
      }
    }

  }) // end of ... component property injection

// define expected props
Catalog.propTypes = {
}

// filter categories to select from
Catalog.CATEGORIES = ['Nature', 'React.js']

export default Catalog
