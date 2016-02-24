'use strict';

import { expect, React, ReactDOM, TestUtils } from '../../util/karma-setup';
import App             from '../app';
import { formatMoney } from 'accounting';
import { appState }    from '../../state/appState'
import { Provider }    from 'react-redux'
import { createStore } from 'redux'
import * as AC         from '../../state/actionCreators'
import Catalog         from '../catalog';
const DATA = require('../../../public/fake-api.json'); // same fixture data browser sync is serving

describe('Catalog Tests', function () {

  // KJB: NOTE: This fixture is setup statically (i.e. outside of beforeEach()
  //      ... because I am generating dynamic tests [i.e. it()] that use this data,
  //      ... which drive the it() characteristics
  //      ... this is possible because our tests do NOT modify the fixture (i.e. it is read-only)
  const store = createStore(appState);
  store.dispatch(AC.catalogItemsDefined(DATA.items));
  let renderedComp    = TestUtils.renderIntoDocument(<Provider store={store}><App/></Provider>);
  let renderedDomNode = ReactDOM.findDOMNode(renderedComp);
  let renderedLiNodes = renderedDomNode.querySelectorAll('.catalog li');

  describe('Checking rendered items', function() {

    it('Setup should be as expected', function () {
      expect(renderedComp).toExist();
      expect(renderedDomNode).toExist();
      expect(renderedLiNodes).toExist();
    });

    it('Insure we render ALL items', function () {
      expect(renderedLiNodes.length).toBe(DATA.items.length);
    });
    
    // dynamically generate a series of tests for each item
    for (let i=0; i<renderedLiNodes.length; i++) {
      const li   = renderedLiNodes[i];
      const item = DATA.items[i];
    
      describe(`Verify Item[${i}]`, function() {
    
        // Verify Names
        const expectedName = item.name;
        it(`name[${i}]: ${expectedName}`, function() {
          const nameElm = li.querySelector(".name");
          expect(nameElm).toExist();
          expect(nameElm.textContent).toEqual(expectedName);
        });
    
        // Verify Prices
        const expectedPrice = formatMoney(item.price);
        it(`price[${i}]: ${expectedPrice}`, function() {
          const priceElm = li.querySelector(".price");
          expect(priceElm).toExist();
          expect(priceElm.textContent).toEqual(expectedPrice);
        });
    
        // NO LONGER DISPLAYED (in our in-line version)
        // // Verify Descriptions
        // const expectedDesc = item.desc;
        // it(`description[${i}]: ${expectedDesc}`, function() {
        //   const descElm = li.querySelector(".desc");
        //   expect(descElm).toExist();
        //   expect(descElm.textContent).toEqual(expectedDesc);
        // });
    
      });
    }

    // dynamic interaction showing detail in modal
    // ... first item only (foo) ... kinda a brittle test
    describe("Clicking image from catalog", function() {
    
      let fooImg = null;
      
      beforeEach(function() {
        fooImg = renderedDomNode.querySelector("li[data-id='1'] img.product");
      });
    
      it("should show details for foo (when clicked)", function() {
        TestUtils.Simulate.click(fooImg); // first click should show
        const details = renderedDomNode.querySelector(".details[data-id='1']");
        expect(details).toExist();
      });
    
      it("should hide details when foo clicked twice", function() {
        TestUtils.Simulate.click(fooImg); // second click should hide
        const details = renderedDomNode.querySelector(".details[data-id='1']");
        expect(details).toNotExist();
      });
    });

  });


  describe('checking filtered items display', function() {
  
    // dynamically generate a series of tests for each category
    for (const testCategory of [...Catalog.CATEGORIES, ""]) {
  
      describe(`select category '${testCategory}'`, function () {
  
        let expectedFilteredItems = null;
  
        beforeEach(function () {
          // apply the desired filter to produce our expected items
          expectedFilteredItems = testCategory ?
                                    DATA.items.filter(x => x.category === testCategory) :
                                    DATA.items;
  
          // select the desired filter within our GUI
          const selectDom = renderedDomNode.querySelector('select.category');
          // ... initially select anything (just for fun)
          TestUtils.Simulate.change(selectDom, { target: { value: Catalog.CATEGORIES[0] }});
          // ... now select the desired item
          TestUtils.Simulate.change(selectDom, { target: { value: testCategory }});
        });
  
        // apply our test
        it(`should display '${testCategory}' items`, function () {
          const actualFilteredItems = renderedDomNode.querySelectorAll('.catalog li');
          expect(actualFilteredItems.length).toBe(expectedFilteredItems.length);
        });
  
      });
  
    }
  
  });


});
