'use strict';

import './util/polyfill'; // needed polyfills (since this is the top-level js entry point for our app)
import httpClient      from 'axios';
import React           from 'react';
import ReactDOM        from 'react-dom';
import { Provider }    from 'react-redux'
import { createStore } from 'redux'
import { appState }    from './state/appState' // our app-wide reducer
import * as AC         from './state/actionCreators'
import App             from './comp/app';


// ***
// *** bootstrap our single-page app
// ***

// define our Redux app-wide store
const store = createStore(appState, undefined,
                          // KJB: optional Redux DevTools Chrome Extension
                          window.devToolsExtension ? window.devToolsExtension() : undefined)

// initial rendering of our app
ReactDOM.render(<Provider store={store}>
                  <App/>
                </Provider>,
                document.querySelector('#appContainer'));

// fetch our data to display
httpClient({ url: '/fake-api.json' })
  .then(resp => {
    console.log("great ... our data fecth was successful!");
    console.log('data', resp.data);
    store.dispatch(AC.catalogItemsDefined(resp.data.items));
  })
  .catch(err => {
    console.error(`OUCH ... an error was encountered in our fetch ... status: ${err.status}: ${err.statusText})`);
    console.error(err);
    // TODO: utilize a UI message alert to inform user of problem
    alert( err.statusText ?
               `Error: ${err.data} - ${err.statusText}` :
               err.toString() );
  });
