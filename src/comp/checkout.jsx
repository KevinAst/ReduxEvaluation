'use strict';

import React     from 'react';
import MyReactComponent from '../util/my-react-component';
import { formatMoney }  from 'accounting';
import Joi       from 'joi-browser';
import AlmondJoi from '../util/almond-joi';
import Select    from 'react-select';
import USStates  from '../util/USStates';
import Esc from '../util/esc';

class Checkout extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      validationState: 0, // a hash of our overal validation state
    };

    // define our validation schema
    // ... we instantiate on each Checkout instance, as it holds instance level validation state
    this.checkoutSchema = new AlmondJoi({
      addr1:      { joi: Joi.string().required(),
                    consolidatedMsg: "address line 1 is required",
                    /* TRY THIS (to activate validation from the get-go: beingValidated: true */ },
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
    });

  }

  componentDidMount() {
    // perform initial validation, once our initial rendering occurs
    this.setState({ validationState: this.checkoutSchema.validate(this.props.fields) });

    Esc.regEscHandler(this.props.closeCheckoutFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeCheckoutFn);
  }

  render() {
    const { fields, total, closeCheckoutFn, updatedFn, saleCompletedFn} = this.props;

    const { validationState } = this.state;

    // update our internal representation of a field change, and perform validation
    const fieldChanged = (e, programmaticChange=false) => {
      // perform our base update (supplied by the client of <Checkout>
      updatedFn(e);

      // inform our validation schema that this field has changed
      // ... stimulating deterministic validation
      if (!programmaticChange)
        this.checkoutSchema.fieldHasChanged(e.target.name);

      // validate our fields, reflecting errors in our GUI
      const updatedProps = // merge our current fields with this recent change
        Object.assign({},
                      fields,
                      { [e.target.name]: e.target.value });

      const validationState = this.checkoutSchema.validate(updatedProps);
      this.setState({ validationState: validationState });
    };

    // perform validation when field has been visited (i.e. focus loss or blur)
    // ... NOTE: this validaion can be conditional based on checkoutSchema heuristics
    const fieldVisited = (e) => {

      // inform our validation schema that this field has been visited
      // ... stimulating deterministic validation
      this.checkoutSchema.fieldHasBeenVisited(e.target.name);

      // validate our fields, reflecting errors in our GUI
      // NOTE: hopefully this is not a race condition
      //       ... i.e. has our fields been updated by now (from onChange)?
      //                I do not think it is
      this.setState({ validationState: this.checkoutSchema.validate(fields) });
    };


    // utility function to format our Credit Card (when it looses focus)
    const creditCardVisited = (e) => {
      // inform our validation schema that this field has been visited
      // ... stimulating deterministic validation
      this.checkoutSchema.fieldHasBeenVisited(e.target.name);

      // format our credit card
      fieldChanged({ target: {
                       name:  e.target.name,
                       value: formatCreditCard(e.target.value) }},
                   true); // programmatic change (i.e. NOT user change)
    };
  
    // utility function to format our Expiry Date (when it looses focus)
    const expiryVisited = (e) => {
      // inform our validation schema that this field has been visited
      // ... stimulating deterministic validation
      this.checkoutSchema.fieldHasBeenVisited(e.target.name);

      // format our expiry
      fieldChanged({ target: {
                       name:  e.target.name,
                       value: formatExpiry(e.target.value) }},
                   true); // programmatic change (i.e. NOT user change)
    };

    // our purchase button was clicked
    const purchaseClick = (e) => {

      // prevent default handler from firing (in this case our form would do a submit)
      e.preventDefault();

      // perform validation ... on ALL fields in our form
      this.checkoutSchema.activateAllValidation();
      const validationState = this.checkoutSchema.validate(fields);
      this.setState({ validationState: validationState }, 
                    () => { // callback of setState() to be executed once state has been applied and rendered

                      if (this.checkoutSchema.isValid()) {
                        saleCompletedFn();
                      }
                      else {
                        // give focus to first invalid field
                        this.refs[this.checkoutSchema.firstFieldInError()].focus();
                      }
                    });
    };

    // convenience function to generate <input> elm with overridable common properties
    const inputTemplate = (fieldName, valueHeuristic, additionalProps) => {
      const commonProps = {
        name:             fieldName,
        ref:              fieldName,
        className:        this.inputClassNames(fieldName),
        title:            this.fieldMsgTitle(fieldName),
        [valueHeuristic]: fields[fieldName], // ... either value= or defaultValue=
        onChange:         fieldChanged,
        onBlur:           fieldVisited
      };

      const propsInUse = Object.assign({}, commonProps, additionalProps);

      return <input {...propsInUse}/>;
    };
    const inputDefault = (fieldName, additionalProps) => inputTemplate(fieldName, "defaultValue", additionalProps);
    const input        = (fieldName, additionalProps) => inputTemplate(fieldName, "value",        additionalProps);

    return (
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
                {inputDefault("addr1", {placeholder:"address line 1", autoFocus:"true", })}
                {inputDefault("addr2", {placeholder:"address line 2", })}
                {inputDefault("city",  {placeholder:"city", })}
                <Select name="state" ref="state"
                        className={"state "+this.inputClassNames("state")}
                        title={this.fieldMsgTitle("state")} 
                        value={fields.state} options={USStates} 
                        onChange={ (selVal) => { fieldChanged({ target: {name: "state", value: selVal} }) }}
                        onBlur={   ()       => { fieldVisited({ target: {name: "state"}                }) }} />
                {inputDefault("zip",  {placeholder:"zip", })}
              </fieldset>

              <fieldset>
                <legend>Email</legend>
                {inputDefault("email", {placeholder:"Your email address", })}
              </fieldset>
            </fieldset>

            <fieldset className="creditCardInfo">
              <legend>Credit Card</legend>
              <label className="ccLabel">
                <span>CardNumber</span>
                {input("creditCard", {placeholder:"1234 5678 90123", onBlur: creditCardVisited })}
              </label>
              <div className="meta">
                <label>
                  <span>Expiry Date</span>
                  {input("expiry", {placeholder:"mm/YY", onBlur: expiryVisited })}
                </label>
                <label>
                  <span>Full Name</span>
                  {inputDefault("fullName", {placeholder:"John Doe" })}
                  
                </label>
                <label>
                  <span>CV Code</span>
                  {input("cvcode", {placeholder:"123" })}
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
                    onClick={purchaseClick}>
              Pay
            </button>
          </form>
        </div>
        { this.displayErrors() }
      </div>
    );
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

  inputClassNames(forField) {
    return this.checkoutSchema.isFieldValid(forField) ?  "" : "inputError";
  }

  fieldMsgTitle(forField) {
    return this.checkoutSchema.detailedFieldMsg(forField);
  }

}

function formatCreditCard(card) {
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


function formatExpiry(expiry) {
  let [mm, yy] = expiry.split('/');
  if (typeof yy !== 'string' && mm.length > 2) {
    yy = mm.slice(2);
    mm = mm.slice(0, 2);
  }
  mm = pad2(mm);
  if (!yy) return mm;
  yy = pad2(yy);
  return [mm, yy].join('/');
}

function pad2(amt) {
  if (amt.length === 1) return '0'+amt;
  return amt;
}

export default Checkout;
