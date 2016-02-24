'use strict';

import React             from 'react';
import ReduxUtil         from '../util/redux-util'
import Select            from 'react-select';
import Joi               from 'joi-browser';
import AlmondJoi         from '../util/almond-joi';
import { formatMoney }   from 'accounting';
import MyReactComponent  from '../util/my-react-component';
import USStates          from '../util/USStates';
import Esc               from '../util/esc';
import * as AC           from '../state/actionCreators'


// ***
// *** Checkout component
// ***

// our internal Checkout$ class (wrapped with Checkout below)
class Checkout$ extends MyReactComponent {

  constructor(...args) {
    super(...args);

    // define our validation schema
    // ... we instantiate on each Checkout instance, as it holds instance level validation state
    //     FOR EXAMPLE: On subsequent instantiations, we want the schema beingValidated setting to be re-set
    this.checkoutSchema = new AlmondJoi({
      addr1:      { joi: Joi.string().required(),
                    consolidatedMsg: "address line 1 is required",
                    /* NOTE: use ... beingValidated: true ... on any schema entry, to validate from the start */ },
      addr2:      { joi: Joi.any().optional() },
      city:       { joi: Joi.string().required(),
                    consolidatedMsg: "city is required" },
      state:      { joi: Joi.string().required(),
                    consolidatedMsg: "state is required (choose from the selection list)" },
      zip:        { joi: Joi.string().required().regex(/^\d{5}(-\d{4})?$/, 'ddddd[-dddd]'), 
                    consolidatedMsg: "zip is required: format: ddddd[-dddd]" },
      email:      { joi: Joi.string().required().email(),
                    consolidatedMsg: "Email is required and must be a valid email address" },
      creditCard: { joi: Joi.string().required().replace(/\s/g, '').creditCard(),
                    consolidatedMsg: "Credit Card Number is required and must be a card format" },
      expiry:     { joi: Joi.string().required().regex(/^[01][0-9]\/[0-9]{2}$/, 'mm/YY'),
                    consolidatedMsg: "Expiry Date is required: format: mm/YY" },
      fullName:   { joi: Joi.string().required(),
                    consolidatedMsg: "Full Name is required" },
      cvcode:     { joi: Joi.string().required().min(3).max(4).regex(/^\d{3,4}$/, 'all digits'),
                    consolidatedMsg: "CV Code is required: 3 or 4 digits" },
    }, this); // pass in our component, allowing AlmondJoi to coordinate React re-renders (visualizing errors), so the validationState does NOT have to be retained in component state

  }

  componentDidMount() {
    // perform initial validation, once our initial rendering occurs
    this.checkoutSchema.validate(this.props.fields)

    Esc.regEscHandler(this.props.closeCheckoutFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeCheckoutFn);
  }

  render() {
    // NOTE: for completeness, this represents a complete list of dependent properties, 
    //       however some are used exclusively by other utility methods
    const {fields, total, cartItems, closeCheckoutFn, updateFieldFn, saleCompletedFn} = this.props;

    return (
      <div className="checkoutModal">
        <div className="checkoutContainer">
          <div className="checkout">
            <button onClick={closeCheckoutFn}
                    className="closeCheckout">Close</button>
            <span className="total">
              Total:
              <span className="formattedTotal">{ formatMoney(total) }</span>
            </span>
            <div className="formWrapper">
              <form>
                <fieldset className="userInfo">
                  <legend>User Info</legend>
          
                  <fieldset>
                    <legend>Shipping Address</legend>
                    {this.inputDefault("addr1", {placeholder:"address line 1", autoFocus:"true", })}
                    {this.inputDefault("addr2", {placeholder:"address line 2", })}
                    {this.inputDefault("city",  {placeholder:"city", })}
                    <Select name="state" ref="state"
                            className={"state "+this.inputClassNames("state")}
                            title={this.fieldMsgTitle("state")} 
                            value={fields.state} options={USStates} 
                            onChange={ (selVal) => { this.fieldChanged({ target: {name: "state", value: selVal} }) }}
                            onBlur={   ()       => { this.fieldVisited({ target: {name: "state"}                }) }} />
                    {this.inputDefault("zip",  {placeholder:"zip", })}
                  </fieldset>
          
                  <fieldset>
                    <legend>Email</legend>
                    {this.inputDefault("email", {placeholder:"Your email address", })}
                  </fieldset>
                </fieldset>
          
                <fieldset className="creditCardInfo">
                  <legend>Credit Card</legend>
                  <label className="ccLabel">
                    <span>CardNumber</span>
                    {this.input("creditCard", {placeholder:"1234 5678 90123", onBlur: this.creditCardVisited })}
                  </label>
                  <div className="meta">
                    <label>
                      <span>Expiry Date</span>
                      {this.input("expiry", {placeholder:"mm/YY", onBlur: this.expiryVisited })}
                    </label>
                    <label>
                      <span>Full Name</span>
                      {this.inputDefault("fullName", {placeholder:"John Doe" })}
                      
                    </label>
                    <label>
                      <span>CV Code</span>
                      {this.input("cvcode", {placeholder:"123" })}
                      {/*  KJB: ORIGINALLY DID NOT HAVE A VALUE AT ALL
                                  ... as a result if you close and open it always starts out blank
                                  ... AI: seems like on every re-render it would blank out constantly
                                          ... unless nothing changed in the dom, so React leaves it alone
                                  HOWEVER ... SEEMS to work the same way WITH value semantics
                                          ... AND, credit card works the same way
                                          ... AI: some one must be blanking them out
                                FROM COURSE:
                                  ... we don't retain show any value on because it is sensitive
                      */}
                    </label>
                  </div>
                </fieldset>
                <button className="pay"
                        onClick={this.purchaseClick}>
                  Pay
                </button>
              </form>
            </div>
            { this.displayErrors() }
          </div>
        </div>
      </div>
    );
  }


  // update our internal representation of a field change, and perform validation
  fieldChanged(e, programmaticChange=false) {

    const {fields, updateFieldFn} = this.props;

    // update field data in our state
    updateFieldFn(e);

    // inform our validation schema that this field has changed
    // ... stimulating deterministic validation
    if (!programmaticChange)
      this.checkoutSchema.fieldHasChanged(e.target.name);

    // validate our fields, reflecting errors in our GUI
    const updatedFields = // merge our current fields with this recent change
    Object.assign({},
                  fields,
                  { [e.target.name]: e.target.value })
      this.checkoutSchema.validate(updatedFields)
  }


  // perform validation when field has been visited (i.e. focus loss or blur)
  // ... NOTE: this validaion can be conditional based on checkoutSchema heuristics
  fieldVisited(e) {
    const {fields} = this.props;

    // inform our validation schema that this field has been visited
    // ... stimulating deterministic validation
    this.checkoutSchema.fieldHasBeenVisited(e.target.name);

    // validate our fields, reflecting errors in our GUI
    // NOTE: hopefully this is not a race condition
    //       ... i.e. has our fields been updated by now (from onChange)?
    //                I do not think it is
    this.checkoutSchema.validate(fields)
  }


  // utility function to format our Credit Card (when it looses focus)
  creditCardVisited(e) {
    // inform our validation schema that this field has been visited
    // ... stimulating deterministic validation
    this.checkoutSchema.fieldHasBeenVisited(e.target.name);

    // format our credit card
    this.fieldChanged({ target: {
                          name:  e.target.name,
                          value: this.formatCreditCard(e.target.value) }},
                      true); // programmatic change (i.e. NOT user change)
  }


  // utility function to format our Expiry Date (when it looses focus)
  expiryVisited(e) {
    // inform our validation schema that this field has been visited
    // ... stimulating deterministic validation
    this.checkoutSchema.fieldHasBeenVisited(e.target.name);

    // format our expiry
    this.fieldChanged({ target: {
                          name:  e.target.name,
                          value: this.formatExpiry(e.target.value) }},
                      true); // programmatic change (i.e. NOT user change)
  }


  // our purchase button was clicked
  purchaseClick(e) {
    const {fields, cartItems, saleCompletedFn} = this.props;

    // prevent default handler from firing (in this case our form would do a submit)
    e.preventDefault();

    // perform validation ... on ALL fields in our form
    const checkoutSchema = this.checkoutSchema;
    checkoutSchema.activateAllValidation();
    checkoutSchema.validate(fields);
    if (checkoutSchema.isValid()) {
      saleCompletedFn(cartItems);
    }
    else {
      // give focus to first invalid field
      this.refs[checkoutSchema.firstFieldInError()].focus();
    }
  }


  // convenience template to generate <input> elm with overridable common properties
  inputTemplate(fieldName, valueHeuristic, additionalProps) {
    const {fields} = this.props;

    const commonProps = {
      name:             fieldName,
      ref:              fieldName,
      className:        this.inputClassNames(fieldName),
      title:            this.fieldMsgTitle(fieldName),
      [valueHeuristic]: fields[fieldName], // ... either value= or defaultValue=
      onChange:         this.fieldChanged,
      onBlur:           this.fieldVisited
    };

    const propsInUse = Object.assign({}, commonProps, additionalProps);

    return <input {...propsInUse}/>;
  }


  // convenience method to generate <input> elm with defaultValue semantice and overridable common properties
  inputDefault(fieldName, additionalProps) {
    return this.inputTemplate(fieldName, "defaultValue", additionalProps)
  }


  // convenience method to generate <input> elm with value semantice and overridable common properties
  input(fieldName, additionalProps) {
    return this.inputTemplate(fieldName, "value", additionalProps)
  }

  displayErrors() {
    if (this.checkoutSchema.isValid())
      return null;
    else
      return <div className="errors">
               { this.checkoutSchema.allProminentMsgs().map(msg => (
                   <div className="error" key={msg}>
                     { msg }
                   </div>
                 )) }
             </div>;
  }


  // return the <input> class name to use for the supplied field (forField)
  inputClassNames(forField) {
    return this.checkoutSchema.isFieldValid(forField) ?  "" : "inputError";
  }


  // return the html title attribute to use for the supplied field (forField)
  // ... used to communicate validation errors
  fieldMsgTitle(forField) {
    return this.checkoutSchema.detailedFieldMsg(forField);
  }


  // format the supplied credit cart
  formatCreditCard(card) {
    const digits = card.replace(/[\D]/g, ''); // strip non-digits
    // amex 4 digits + 6 digits + 5 digits
    if (digits[0] === '3') {
      return (digits.slice(0, 4) + ' ' + // first 4
              digits.slice(4, 10) + ' ' + // next 6
              digits.slice(10)).trim(); // remaining 5
    } else {
      // other cards split groups of 4 digits
      return (digits.slice(0, 4) + ' ' +
              digits.slice(4, 8) + ' ' +
              digits.slice(8, 12) + ' ' +
              digits.slice(12)).trim();
    }
  }

  // format the supplied expiry date
  formatExpiry(expiry) {
    let [mm, yy] = expiry.split('/');
    if (typeof yy !== 'string' && mm.length > 2) {
      yy = mm.slice(2);
      mm = mm.slice(0, 2);
    }
    mm = this.pad2(mm);
    if (!yy) return mm;
    yy = this.pad2(yy);
    return [mm, yy].join('/');
  }

  // zero pad to two digits
  pad2(amt) {
    if (amt.length === 1) return '0'+amt;
    return amt;
  }

} // end of ... class Checkout$



//***
//*** wrap our internal Checkout$ class with a public Checkout class
//*** that injects properties (both data and behavior) from our state.
//***

const Checkout = ReduxUtil.wrapCompWithInjectedProps(Checkout$, {
                   mapStateToProps: (appState, ownProps) => {
                     return {
                       fields:    appState.checkout.fields,
                       total:     appState.checkout.total,
                       cartItems: appState.cart.cartItems,
                     }
                   },
                   mapDispatchToProps: (dispatch, ownProps) => {
                     return {
                       closeCheckoutFn: (e)         => { dispatch(AC.closeCheckout()) },
                       updateFieldFn:   (e)         => { dispatch(AC.setCheckoutField(e.target.name, e.target.value)) },
                       saleCompletedFn: (cartItems) => { dispatch(AC.saleComplete(cartItems)) },
                     }
                   }
                 });

// define expected props
Checkout.propTypes = {
}

export default Checkout;
