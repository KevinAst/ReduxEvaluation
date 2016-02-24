'use strict';

import React         from 'react';
import ReduxUtil     from '../util/redux-util'
import { PropTypes } from 'react'
import ItemRow       from './item-row';
import * as AC       from '../state/actionCreators'


// ***
// *** Catalog of items component
// ***

// our internal Catalog$ class (wrapped with Catalog below)
const Catalog$ = ({items, filterCategory, changeFilterCategory}) => {

  const filteredItems = filterCategory ?
                          items.filter(item => item.category === filterCategory) :
                          items;
  return (
    <div>
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
      <ul className="product catalog">
        { filteredItems.map(item => (
            <ItemRow key={item.id}
                     item={item}
                     allowBuy={true}
                     allowDetails={true}/>
          ))
        }
      </ul>
    </div>
  );
}


//***
//*** wrap our internal Catalog$ class with a public Catalog class
//*** that injects properties (both data and behavior) from our state.
//***

const Catalog = ReduxUtil.wrapCompWithInjectedProps(Catalog$, {
                  mapStateToProps: (appState, ownProps) => {
                    return {
                      items:          appState.catalog.items,
                      filterCategory: appState.catalog.filterCategory,
                    }
                  },
                  mapDispatchToProps: (dispatch, ownProps) => {
                    return {
                      changeFilterCategory: (category) => { dispatch(AC.filterCatalogCategory(category)) },
                    }
                  }
                });

// define expected props
Catalog.propTypes = {
}

// filter categories to select from
Catalog.CATEGORIES = ['Nature', 'React.js'];

export default Catalog;
