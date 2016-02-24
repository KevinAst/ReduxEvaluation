'use strict';

import { expect, React, ReactDOM, TestUtils }  from '../../util/karma-setup';
import App              from '../app';
import { formatMoney }  from 'accounting';
import { appState }     from '../../state/appState' // our app-wide reducer
import { Provider }     from 'react-redux'
import { createStore }  from 'redux'
import * as AC          from '../../state/actionCreators'
const DATA = require('../../../public/fake-api.json'); // same fixture data browser sync is serving


describe('cart', function () {
  let renderedComp;
  let domNode;
  beforeEach(function () {
    const store = createStore(appState);
    store.dispatch(AC.catalogItemsDefined(DATA.items));
    renderedComp = TestUtils.renderIntoDocument(<Provider store={store}><App/></Provider>);
    domNode      = ReactDOM.findDOMNode(renderedComp);
  });

  describe('clicked on Cart link from catalog', function () {
    beforeEach(function () {
      const link = domNode.querySelector('.cartButton a');
      TestUtils.Simulate.click(link);
    });

    it('should show empty cart', function () {
      const cart = domNode.querySelector('.cart');
      expect(cart).toExist();
    });

    describe('click Continue Shopping button', function () {
      beforeEach(function () {
        TestUtils.Simulate.click(domNode.querySelector('button.continue'));
      });

      it('should close the cart', function () {
        const cart = domNode.querySelector('.cart');
        expect(cart).toNotExist();
      });
    });
  });

  describe('clicked on bar buy button from catalog', function () {
    beforeEach(function () {
      TestUtils.Simulate.click(domNode.querySelector('li[data-id="2"] button.buy'));
    });

    it('should show cart with bar item', function () {
      const item = domNode.querySelector('.cart li[data-id="2"]');
      expect(item).toExist();
    });

    it('should have 1 for qty for bar item', function () {
      const qty = domNode.querySelector('.cart li[data-id="2"] input[name="qty"]');
      expect(qty.value).toBe('1');
    });

    describe('closing cart and clicking bar buy button from catalog', function () {
      beforeEach(function () {
        TestUtils.Simulate.click(domNode.querySelector('button.continue'));
        TestUtils.Simulate.click(domNode.querySelector('li[data-id="2"] button.buy'));
      });

      it('should have 2 for qty for bar item', function () {
        const qty = domNode.querySelector('.cart li[data-id="2"] input[name="qty"]');
        expect(qty.value).toBe('2');
      });
    });

    describe('change bar qty to 10', function () {
      beforeEach(function () {
        const qty = domNode.querySelector('.cart li[data-id="2"] input[name="qty"]');
        TestUtils.Simulate.change(qty, { target: { name: 'qty', value: '10' }});
      });

      it('should have formatted total for bar item lineTotal', function () {
        const lineTotal = domNode.querySelector('.cart li[data-id="2"] .lineTotal');
        const expectedTotal = formatMoney(10 * DATA.items[1].price);
        expect(lineTotal.innerHTML).toBe(expectedTotal);
      });

      it('should have a formatted total for all items', function () {
        const formattedTotal = domNode.querySelector('.formattedTotal');
        const expectedTotal = formatMoney(10 * DATA.items[1].price);
        expect(formattedTotal.innerHTML).toBe(expectedTotal);
      });
    });

    describe('remove item button clicked', function () {
      beforeEach(function () {
        TestUtils.Simulate.click(domNode.querySelector('.cart li[data-id="2"] button.remove'));
      });

      it('should remove the item from the cart', function () {
        const lineItem = domNode.querySelector('.cart li[data-id="2"]');
        expect(lineItem).toNotExist();
      });

      it('should zero the total', function () {
        const formattedTotal = domNode.querySelector('.formattedTotal');
        const expectedTotal = formatMoney(0);
        expect(formattedTotal.innerHTML).toBe(expectedTotal);
      });
    });
  });
});
