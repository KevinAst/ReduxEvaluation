'use strict';

import React from 'react';
import ItemRow from './item-row';

function Catalog({items, itemExpanded, buyFn, categories, catChangeFn, itemClickFn}) {
  return (
    <div>
      Category:
      <select onChange={catChangeFn} className="category">
        <option value="">All</option>
        { categories.map(c =>
            <option key={c}
                    value={c}>
              {c}
            </option> )
        }
      </select>
      <ul className="product catalog">
        { items.map(item => (
            <ItemRow key={item.id}
                     item={item}
                     itemExpanded={itemExpanded}
                     buyClickedFn={() => buyFn(item)}
                     clickFn={() => itemClickFn(item)}/> ))
        }
      </ul>
    </div>
  );
}

export default Catalog;
