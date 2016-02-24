'use strict';

import { expect, React, ReactDOM, TestUtils } from '../../util/karma-setup';
import App              from '../app';
import { formatMoney }  from 'accounting';
import { unitPrice }    from '../../util/money';
import { appState }     from '../../state/appState'
import { Provider }     from 'react-redux'
import { createStore }  from 'redux'
import * as AC          from '../../state/actionCreators'
const { renderIntoDocument, Simulate } = TestUtils;
const DATA = require('../../../public/fake-api.json');

describe('receipt', function () {
  let renderedComp;
  let domNode;
  beforeEach(function () {
    const store = createStore(appState);
    store.dispatch(AC.catalogItemsDefined(DATA.items));
    renderedComp = TestUtils.renderIntoDocument(<Provider store={store}><App/></Provider>);
    domNode = ReactDOM.findDOMNode(renderedComp);
  });

  it('should not have a receipt', function () {
    const modal = domNode.querySelector('.modal.receipt');
    expect(modal).toNotExist();
  });

  function enterData(data) {
    const fieldNames = ['addr1', 'addr2', 'city', 'state', 'zip', 'email', 'creditCard', 'expiry', 'fullName', 'cvcode'];
    const inputMap = fieldNames.reduce((accum, name) => {
      if (name === "state") // for state (a React Select component) we must drill into the correct input
        accum[name] = domNode.querySelector('.checkout div.state .Select-input input');
      else
        accum[name] = domNode.querySelector(`.checkout input[name="${name}"]`);
      return accum;
    }, {});
    Object.keys(data).forEach(k => {
      const v = data[k];
      Simulate.change(inputMap[k], { target: { name: k, value: v }});
      if (k==="state") { // for state (a React Select component) we must PRESS ENTER to ACCEPT value
		    TestUtils.Simulate.keyDown(inputMap[k], { keyCode: 13, key: 'Enter' });
      }
    });
  }

  describe('clicked on bar buy button from catalog and checkout', function () {
    beforeEach(function () {
      Simulate.click(domNode.querySelector('li[data-id="2"] button.buy'));
      Simulate.click(domNode.querySelector('button.checkout'));
    });

    describe('after entering all fields and clicking pay button', function () {
      beforeEach(function () {
        enterData({
          addr1: '3005 Williams Ct.',
          city:  'Kokomo',
          state: 'IN',
          zip:   '54321',
          email: 'a@b.com',
          creditCard: '4111111111111111',
          expiry: '12/20',
          fullName: 'John Smith',
          cvcode: '123'
        });
        Simulate.click(domNode.querySelector('.checkout button.pay'));
      });

      it('should show receipt', function () {
        const modal = domNode.querySelector('.modal.receipt');
        expect(modal).toExist();
      });

      it('should have 1 line item', function () {
        const arrLineItems = domNode.querySelectorAll('.receipt li');
        expect(arrLineItems.length).toBe(1);
      });

      it('should have a line item qty of 1', function () {
        const qty = domNode.querySelector('.receipt li[data-id="2"] .qtyValue');
        expect(qty.innerHTML).toBe('1');
      });

      it('should have a line item total', function () {
        const lineTotal = domNode.querySelector('.receipt li[data-id="2"] .lineTotal');
        const expectedTotal = formatMoney(unitPrice(DATA.items[1].price, 1));
        expect(lineTotal.innerHTML).toBe(expectedTotal);
      });

      it('should have a grand total', function () {
        const total = domNode.querySelector('.receipt .formattedTotal');
        const expectedTotal = formatMoney(unitPrice(DATA.items[1].price, 1));
        expect(total.innerHTML).toBe(expectedTotal);
      });

      describe('clicking close', function () {
        beforeEach(function () {
          Simulate.click(domNode.querySelector('.receipt button.close'));
        });

        it('should close the receipt', function () {
          const modal = domNode.querySelector('.modal.receipt');
          expect(modal).toNotExist();
        });
      });
    });
  });
});
