'use strict';

import React from 'react';

/**
 * A common base class for all my app's react components.
 */
class MyReactComponent extends React.Component {

  constructor(...args) {
    super(...args);

    // autobind each method of our class to self, supporting efficient React event registration
    // NOTE: current logic only locates methods of the concrete class
    //       ... to support a multi-level class hierarchy, we must walk the prototype chain
    const myPropNames = Object.getOwnPropertyNames( Object.getPrototypeOf(this) );
    for (const propName of myPropNames) {
      const value = this[propName];
      if (typeof value === "function" && propName !== "constructor") {
        //console.log("MyReactComponent: autobinding " + propName + "() method to self.");
        this[propName] = value.bind(this);
      }
    }
  }
}

export default MyReactComponent;
