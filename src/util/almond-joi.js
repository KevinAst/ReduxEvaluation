'use strict';

import Joi from 'joi-browser';
import crc from 'crc';


/**
 * AlmondJoi is a thin wrapper around the Joi Validation utility,
 * providing application-specific value added functionality.
 * 
 * Please note that this class NOT intended to be an overall generic
 * utility, rather one that promotes desired application specific
 * heuristics.
 * 
 * AlmondJoi is used to validate multiple fields ... typically from a
 * form.  
 * 
 * 
 * Validation API:
 * ==============
 * 
 * AlmondJoi holds the Joi schema internally.  As such all validate()
 * requests are processed by AlmondJoi, providing an internal
 * post-processing hook, with some value-added methods:
 * 
 *   validate(fields): validationState <hash>
 *   isValid(): boolean
 *   firstFieldInError(): String
 *   allProminentMsgs(): String[]
 * 
 * The validationState is a hash containing an aggregation of all our
 * validation results, which is suitable to determine if React needs to
 * re-generate.
 * 
 * The isValid() is a convenience method to determine if any validation
 * errors exist.
 * 
 * The firstFieldInError() is a convenience method that returns the first
 * field name <String> in error (null for valid).
 * 
 * The allProminentMsgs() is a convenience method that returns all
 * prominent msgs spanning all fields [one per field] (empty array for
 * valid).
 * 
 * 
 * Deterministic Validation
 * ========================
 * 
 * One of the key features of AlmondJoi is that field validation can be
 * promoted early, not just when a Process button is activated.  I
 * understand that an initial form display should not be filled with
 * errors, however, once the user adds data, and leaves the field, in
 * most cases can be validated at that time.  This way the user doesn't
 * have to wait until a Process button is clicked to determine that an
 * invalid field has been entered.
 * 
 * The client of AlmondJoi accomplishes this by keeping track of whether a
 * field has changed (onChange events) and has been visited (onBlur
 * events).
 * 
 * - Initially only selected fields are validated, based on whether the
 *   field has been visited and modified by the user (see:
 *   fieldHasChanged() [activated via onChange event] and
 *   fieldHasBeenVisited() [activated via onBlur event]).
 * 
 * - Ultimately, all fields are validated ... typically when a process
 *   form request is issued (see: activateAllValidation()).
 * 
 * As an example, once an email address has been entered, and the user
 * tabs off of that field, we can validate it.  Of course course, when
 * you click the Pay button, all remaining validation occurs (as
 * always):
 * 
 * 
 * Consolidated Messages
 * =====================
 * 
 * AlmondJoi promotes it's own value-added schema, providing additional per
 * field features (such as a consolidatedMsg and beingValidated).  Here
 * is a sample schema (NOTE: only the joi attribute is REQUIRED, ALL
 * others are OPTIONAL):
 * 
 *  const mySchema = new AlmondJoi({
 *    addr1:      { joi: Joi.string().required(),
 *                  consolidatedMsg: "address line 1 is required",
 *                  beingValidated: true},
 *    zip:        { joi: Joi.string().required().regex(/^\d{5}(-\d{4})?$/, 'ddddd[-dddd]'), 
 *                  consolidatedMsg: "zip is required: format: ddddd[-dddd]" },
 *    email:      { joi: Joi.string().email().required(),
 *                  consolidatedMsg: "Email is required and must be a valid email address" },
 *  });
 * 
 * The optional consolidatedMsg is used to promote a single message that
 * summarizes the entire requirements of a field validation.
 * 
 * The optional beingValidated attribute activates field-specific
 * validation right away (no need to wait for fieldHasChanged() and
 * fieldHasBeenVisited()).
 * 
 * 
 * Prominent vs. Detailed Messages
 * ===============================
 * 
 * AlmondJoi promotes two different levels of validation messages.
 * 
 *  - Prominent: a single message per field, that a user will want to
 *    prominently focus on.  This is either the consolidatedMsg (when
 *    defined) or the first Joi message.
 * 
 *  - Detailed: a single message per field, that provides more detail.
 *    This is always the first Joi message (which can change, depending
 *    on which constraint has been violated).
 * 
 * As an example, you could define consolidated messages that appear in
 * the dialog, and by hovering over a field in error, it will dynamically
 * show the detailed message.
 * 
 * 
 * Message Access by Field
 * =======================
 * 
 * In addition to the sequential array of validation messages provided
 * by Joi (allProminentMsgs()), AlmondJoi promotes a field-specific API:
 * 
 *   isFieldValid(field): boolean
 *   prominentFieldMsg(field): String
 *   detailedFieldMsg(field):  String
 *   detailedFieldMsgs(field): String[]
 *
 * @author Kevin Bridges
 */
class AlmondJoi {

  constructor(mySchema) {

    if (!mySchema) {
      throw new Error("ERROR: AlmondJoi() mySchema parameter is required");
    }

    // extract joiSchemaObj and cntl from mySchema
    const joiSchemaObj = {};
    const cntl = this.cntl = {};
    const fields = this.fields = Object.getOwnPropertyNames(mySchema);
    for (const field of fields) {
      const myObj = mySchema[field];
      if (!myObj.joi) {
        throw new Error(`ERROR: AlmondJoi() mySchema.${field} requires a joi object`);
      }
      joiSchemaObj[field] = myObj.joi;

      cntl[field] = {
        consolidatedMsg: myObj.consolidatedMsg, // <optional> null/undefined for none
        hasChanged:      false,  // <boolean> has user changed field
        hasVisited:      false,  // <boolean> has user visited field
        beingValidated:  myObj.beingValidated ? true : false,  // <boolean> is field being validated
        detailedMsgs:    [],     // detailed joi msgs per field <string[]> (joiResult.error.details[x].message)
                                 // ... empty array for valid field
      };

    }

    // retain internal compiled joiSchema
    this.joiSchema = Joi.object().keys(joiSchemaObj);

    // initialize remaining state
    _firstFieldInError.set(this, null);
    _allProminentMsgs.set(this, []);
  }
 
  fieldHasChanged(field) {
    const cntlField = this.cntlField(field);

    cntlField.hasChanged = true;
    
    // NO NO NO: we only want to start initial validation, when user leaves the field (visited)
    // if (cntlField.hasVisited)
    //   cntlField.beingValidated = true;
  }

  fieldHasBeenVisited(field) {
    const cntlField = this.cntlField(field);

    cntlField.hasVisited = true;

    // dynamically start validating field if it has been changed by the user, and has been visited
    // ... stimulating deterministic validation
    if (cntlField.hasChanged)
      cntlField.beingValidated = true;
  }

  // force  all fields to be validated (from this point forward)
  // ... typically invoked in a pre-process-form-request (just prior to validate())
  activateAllValidation() { 
    for (const field of this.fields) {
      this.cntl[field].beingValidated = true;
    }
    // TODO: how do we insure that client invokes validate() after this?
    //       1) NO:  call it validateAll(fieldValues)
    //               and pass on to validate(fieldValues)   
    //       2) NO:  set internal indicator that validate required
    //       3) YES: I think validate() is required in a number of scenerios
    //               ... NOT just this one
    //               ... For now, let's just assume the client knows how to use AlmondJoi
  }


  // perform validation on supplied fields { field1: value1, field2: value2, ... }
  // ... return validationState - a hash containing an aggregation of all our validation results
  //                              suitable to determine if React needs to re-generate
  validate(fields) {
    
    const joiResult = Joi.validate(fields, 
                                    this.joiSchema,
                                    { // TODO: provide AlmondJoi client hooks to change these options
                                      abortEarly: false, // give us all the errors at once (both for all fields and multiple errors per field)
                                    });

    // post process joiResult
    // ... clear all prior messages
    let allProminentMsgs = [];
    for (const field of this.fields) {
      this.cntl[field].detailedMsgs = [];
    }
    // ... retain new joiResult, and accumulate our validationState
    let validationState   = crc.crc32("AlmondJoi:validationState");
    let firstFieldInError = null;
    if (joiResult.error) { // something was invalid
      for (const detail of joiResult.error.details) {
        const path = detail.path;
        if (!firstFieldInError) {
          firstFieldInError = path;
        }
        if (this.cntl[path].beingValidated) {
          this.cntl[path].detailedMsgs.push(detail.message);
          if (this.cntl[path].detailedMsgs.length === 1) // allProminentMsgs only contain the first msg per field
            allProminentMsgs.push( this.cntl[path].consolidatedMsg || detail.message);
          validationState = crc.crc32(detail.message, validationState);
        }
      }
    }
    _firstFieldInError.set(this, firstFieldInError);
    _allProminentMsgs.set(this, allProminentMsgs);

    // that's all folks :-)
    // console.log("validationState: " + validationState.toString(16));
    return validationState.toString(16);
  }

  // return indicator as to ALL fields are valid [or NOT being validated] (true) or invalid (false)
  isValid() {
    return this.allProminentMsgs().length === 0;
  }

  // return the first field name in error <String>
  // ... null for valid
  firstFieldInError() {
    return  _firstFieldInError.get(this);
  }

  // return all prominent msgs spanning all fields (one per field)
  // ... using optional consolidatedMsg (when defined) or first detailedMsg
  // ... empty array for valid
  allProminentMsgs() {
    return  _allProminentMsgs.get(this);
  }

  // return indicator as to whether supplied field is valid [or NOT being validated] (true) or invalid (false)
  isFieldValid(field) {
    const cntlField = this.cntlField(field);
    return (!cntlField.beingValidated || cntlField.detailedMsgs.length === 0) ? true : false;
  }

  // return the most prominent error message (if any) for the given field
  // ... either consolidatedMsg (when defined) or first joi error
  // ... "" for valid (or field not yet being validated)
  prominentFieldMsg(field) {
    if (this.isFieldValid(field))
      return "";
    const  cntlField = this.cntlField(field);
    return cntlField.consolidatedMsg || cntlField.detailedMsgs[0];
  }

  // return the initial joi detailed error message (if any) for the
  // given field (one per field), describing specific violations
  // ... "" for valid (or field not yet being validated)
  detailedFieldMsg(field) {
    if (this.isFieldValid(field))
      return "";
    const  cntlField = this.cntlField(field);
    return cntlField.detailedMsgs[0];
  }

  // return all the joi detailed error messages (if any) for the
  // given field, describing specific violations
  // ... [] for valid (or field not yet being validated)
  detailedFieldMsgs(field) {
    const  cntlField = this.cntlField(field);
    return cntlField.detailedMsgs;
  }

  // INTERNAL
  cntlField(field) {
    const cntlField = this.cntl[field];
    if (!cntlField)
      throw new Error(`ERROR: AlmondJoi NON-EXISTANT field ${field}`);
    return cntlField;
  }      

}

// private members
const _firstFieldInError = new WeakMap(); // <String> 
const _allProminentMsgs  = new WeakMap(); // <String[]>

export default AlmondJoi;

// Joi FAILS to document validate() return structure
// ... grrr
// ... actually it does (sort of) doc joiResult.error at: https://github.com/hapijs/joi/blob/v7.2.3/API.md#errors
//     joiResult = {
//       error: { // undefined (or null - not sure) when validation passes
//         message: "accumulation of ALL messages (not very useful)",
//         isJoi: true,
//         name: ValidationError
// KEY:    details: [ // array of error instances
//           {
//             path: "addr1",
//             type: "any.empty",
//             message: '"addr1" is not allowed to be empty',
//           },
//           {
//             path: "zip",
//             type: "any.empty",
//             message: '"zip" is not allowed to be empty',
//           },
//           {
//             path: "zip",
//             type: "string.regexp.name",
//             message: '"zip" with value "" fails to match the ddddd[-dddd] pattern',
//           },
//         ],
//         _object: { // the original object to validate
//           addr1: "",
//           zip: "",
//           ... etc.
//         },
//       },
//       value: { // regurgitation of fields under validation ... ex:
//         addr1: "",
//         zip: "",
//         ... etc.
//                
//       },
//     }
