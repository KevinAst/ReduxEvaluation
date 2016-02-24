# ReduxEvaluation

## Overview

This project is an evaluation of the
[Redux](https://github.com/reactjs/redux/) framework (a popular
[Flux](https://facebook.github.io/flux/) implementation)
used in conjunction with [React](https://facebook.github.io/react/).

The app itself is a Shopping Cart, which is part of the
[CodeWinds](http://codewinds.com/) React 101 training course.

The app has been implemented in two different ways (found in different
branches of this project).  This allows you to directly compare the
two different implementations.  The branches are:

 - **PlainReact**: The original React app without Redux.  The top-level
   `<App>` component maintains application state, and contains
   the function to alter this state.  Redux properties are trickled
   down from this `<App>` component throughout the entire containment
   tree.

 - **ReduxReact**: A refactor of this same React app, utilizing the
   Redux framework.

Please refer to the master branch of this README.md, to see the full
results of this evaluation.
