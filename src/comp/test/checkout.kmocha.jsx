'use strict';

import { expect, React, ReactDOM, TestUtils } from '../../util/karma-setup';
import App              from '../app';
import { formatMoney }  from 'accounting';
import { appState }     from '../../state/appState'
import { Provider }     from 'react-redux'
import { createStore }  from 'redux'
import * as AC          from '../../state/actionCreators'
const DATA = require('../../../public/fake-api.json'); // same fixture data browser sync is serving


describe('Checkout Tests', function () {

  // KJB: NOTE: This fixture is setup statically (i.e. outside of beforeEach()
  //      ... because I am generating dynamic tests [i.e. it()] that use this data,
  //      ... which drive the it() characteristics
  //      ... this is possible because our tests do NOT modify the fixture (i.e. it is read-only)
  //      TODO: this has started to be a bit dicy with the advent of entering data (must fill in fields in the right order)
  const store = createStore(appState);
  store.dispatch(AC.catalogItemsDefined(DATA.items));
  let renderedComp    = TestUtils.renderIntoDocument(<Provider store={store}><App/></Provider>);
  let renderedDomNode = ReactDOM.findDOMNode(renderedComp);
  
  // KJB: utility driving GUI data entry for validation tests
  function enterData(data) { // data is simple object with field/value pairs ... ex: { email: 'a@b.com', expiry: '12/20' }
    const fieldNames = ['addr1', 'addr2', 'city', 'state', 'zip', 'email', 'creditCard', 'expiry', 'fullName', 'cvcode'];

    // KJB: kool - provides a DOM mapping of all our input fields
    //      ... ex: inputDomMap.email is the dom input for email
    const inputDomMap = fieldNames.reduce((accum, name) => {
      if (name === "state") // for state (a React Select component) we must drill into the correct input
        accum[name] = renderedDomNode.querySelector('.checkout div.state .Select-input input');
      else
        accum[name] = renderedDomNode.querySelector(`.checkout input[name="${name}"]`);
      return accum;
    }, {});

    // KJB: for each item passed in (ex: data.email), use it's value to update the GUI
    Object.keys(data).forEach(k => {
      const v = data[k];

      // KJB: kool - simulate change in our input dom
      TestUtils.Simulate.change(inputDomMap[k], { target: { name: k, value: v }});
      if (k==="state") { // for state (a React Select component) we must PRESS ENTER to ACCEPT value
		    TestUtils.Simulate.keyDown(inputDomMap[k], { keyCode: 13, key: 'Enter' });
      }
    });
  }


  describe('item-row buy clicked and checkout', function () {
    beforeEach(function () {
      TestUtils.Simulate.click(renderedDomNode.querySelector('.catalog li[data-id="1"] button.buy'));
      TestUtils.Simulate.click(renderedDomNode.querySelector('button.checkout'));
    });

    // KJB: do this first due to non beforeEach() setup, don't want buy button to be clicked twice
    it('should have proper total', function () {
      const formattedTotal = renderedDomNode.querySelector('.checkout .formattedTotal');
      const expectedValue = formatMoney(DATA.items[0].price);
      expect(formattedTotal.innerHTML).toBe(expectedValue);
    });
  
    it('should show checkout modal', function () {
      const modal = renderedDomNode.querySelector('.checkoutModal .checkout');
      expect(modal).toExist();
    });

    it('should not have errors displayed initially', function () {
      const errors = renderedDomNode.querySelector('.checkout .errors');
      expect(errors).toNotExist();
    });


    describe('clicking pay button without filling anything in', function () {
      beforeEach(function () {
        TestUtils.Simulate.click(renderedDomNode.querySelector('button.pay'));
      });

      it('should show 9 errors', function () {
        const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
        expect(errorDivs.length).toBe(9);
      });

      describe('after entering email', function () {
        beforeEach(function () {
          const email = renderedDomNode.querySelector('.checkout input[name="email"]');
          TestUtils.Simulate.change(email, { target: { name: 'email', value: 'a@b.com' }});
        });

        it('should have 8 errors', function () {
          const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
          expect(errorDivs.length).toBe(8);
        });

      });

      describe('after entering partial data', function () {

        beforeEach(function () {
          enterData({
            email: 'a@b.com',
            creditCard: '4111111111111111',
            expiry: '12/20'
          });
        });

        it('should have 6 errors', function () {
          const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
          expect(errorDivs.length).toBe(6);
        });
      });

      describe('after entering all fields', function () {
        beforeEach(function () {
          enterData({
            addr1: '3005 Williams Ct.',
            city:  'Kokomo',
            state: 'IL',
            zip:   '54321',
            email: 'a@b.com',
            creditCard: '4111111111111111',
            expiry: '12/20',
            fullName: 'John Smith',
            cvcode: '123'
          });
        });

        it('should NOT have errors', function () {
          const errors = renderedDomNode.querySelector('.checkout .errors');
          if (errors) // definitively shows which field was in error
            console.error("UNEXPECTED ERRORS: ", errors);
          expect(errors).toNotExist();
        });
      });

    });

  });
});
