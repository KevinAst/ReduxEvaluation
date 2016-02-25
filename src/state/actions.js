'use strict'

/**
 * Promote all actions used in our app ... both:
 *
 *   - AC: Action Creators
 *         A series of public functions that create actions.
 *         EX Usage:  AC.saleComplete(receiptId, receiptItems): Action
 *         EX Action: { type: "saleComplete", receiptId, receiptItems }
 *
 *   - AT: Action Types
 *         A series of Strings, representing our Action Types
 *         (used internally by our reducers [injected into each action]).
 *         EX: AT.saleComplete = "saleComplete"
 *
 * PUBLIC NOTE: 
 *   To determine what Action Creators are availble, simply interpret
 *   the funcWithParms structure (below) as follows:
 *     - The funcWithParms key is the function name
 *     - The funcWithParms value array represents the expected function parameters
 *   EXAMPLE: AC.saleComplete(receiptId, receiptItems): Action
 *
 *
 * INTERNAL NOTE: 
 *   This technique of creating AC/ATs has the following benefits:
 *   
 *    - The Action Creators (AC) 
 *      * Concisely defines all the actions you can perform within the app
 *      * Promotes and validates the exact set of expected parameters
 *        ... at least the number of parameters
 *        ... the parameter types are not validated, but the name gives a hint of expectations
 *        ... here is an example error that is thrown if number of parms are incorrect:
 *            ERROR: Action Creator AC.saleComplete(receiptId,receiptItems) expecting 2 parameters, but received 3
 *      * Correctly constructs the action every time
 *   
 *    - The Action Types (AT):
 *      * Are consisely defined from the same definition
 *   
 *    - Minimal development effort in maintaining the AC/ATs
 */

const funcWithParms = {
  buyItem:               ["item"],
  catalogItemsDefined:   ["items"],
  checkout:              ["total"],
  closeCart:             [],
  closeCheckout:         [],
  closeReceipt:          [],
  filterCatalogCategory: ["category"],
  openCart:              [],
  removeCartItem:        ["cartItem"],
  saleComplete:          ["receiptId", "receiptItems"],
  setCartItemQty:        ["cartItem", "qty"],
  setCheckoutField:      ["name", "value"],
  toggleItemDetail:      ["item"],
}

// AT: Action Types container object
//     EX: AT.saleComplete = "saleComplete"
export const AT = {}

// AC: Action Creators container object
//     EX: AC.saleComplete(receiptId, receiptItems): Action
export const AC = {}

// machine generate our AT/ACs
for (let funcName in funcWithParms) {

  const actionType = funcName // alias ... our funcName is one and the same as our actionType

  AT[actionType] = actionType

  AC[funcName] = function(...args) {
    const parmNames = funcWithParms[funcName]
    if (parmNames.length !== args.length) {
      // ex: ERROR: Action Creator AC.saleComplete(receiptId,receiptItems) expecting  parameters, but received 3
      throw new Error(`ERROR: Action Creator AC.${funcName}(${parmNames.toString()}) expecting ${parmNames.length} parameters, but received ${args.length}`)
    }
    const action = { type: actionType } // baseline our action with it's type
    for (let i=0; i<args.length; i++) { // inject the arguments into our action
      action[parmNames[i]] = args[i]
    }
    return action
  }
}
