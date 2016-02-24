'use strict';

/*
   Main file which browser launches

   Catalog and Shopping Cart example app
   - Fetches catalog data from REST API
   - Renders as catalog
   - Shopping cart of selected items
   - Checkout form with validation
 */

// KJB: include needed polyfills (since this the top-level js entry point in our app)
import './util/polyfill'; // first import polyfills

// KJB: import axios (promise based http client)
// KJB: axios is referenced in the dependencies of package.json
import httpClient from 'axios';

// KJB: react and react-dom is referenced in the dependencies of package.json
import React from 'react';
import ReactDOM from 'react-dom';
import App from './comp/app';

const appContainerDiv = document.querySelector('#appContainer');

function render(data) {
  console.log("KJB: in browser.jsx render() method ..." + data.items[0].name);
  ReactDOM.render(<App items={data.items}/>,
                  appContainerDiv);
}

function renderError(err) {
  const errMsg = (err.statusText) ?
                 `Error: ${err.data} - ${err.statusText}` :
                 err.toString();
  ReactDOM.render(<div>{ errMsg }</div>, appContainerDiv);
}

function fetchData() {
  return httpClient({ url: '/fake-api.json' });
}

function fetchDataAndRender() {
  fetchData()
    .then(resp => {
      console.log("great ... our data fecth was successful!");
      console.log('data', resp.data);
      render(resp.data);
    })
    // KJB: NO LIKEY: an error in render() invocation (above) funnels here
    .catch(err => {
      console.error(`OUCH ... an error was encountered in our fetch ... status: ${err.status}: ${err.statusText})`);
      console.error(err);
      renderError(err);
    });
}

fetchDataAndRender();
