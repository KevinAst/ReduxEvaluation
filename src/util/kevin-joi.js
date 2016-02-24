'use strict';

import Joi from 'joi-browser';

// provide Joi.validate() enhancement supporting following option(s):
//   kevinSaysPruneDupPaths: true/false ... only emit the first of potentially may errors per field (i.e. path)
if (!Joi.kevinOriginalValidate) {

  // retain original definition
  Joi.kevinOriginalValidate = Joi.validate;

  // provide our override shim
  Joi.validate = function(...args) {
    const [value, schema, options, callback] = args;

    // interpret our value added directive(s) from options
    const kevinSaysPruneDupPaths = "kevinSaysPruneDupPaths";
    let   pruneDupPaths = false;
    if (options && options.hasOwnProperty(kevinSaysPruneDupPaths)) {
      pruneDupPaths = options[kevinSaysPruneDupPaths];
      // must remove these additional options, as Joi balks at unrecognized options
      const didDelete = delete options.kevinSaysPruneDupPaths;
    }

    // pass through to the original Joi.validate
    const joiResult = Joi.kevinOriginalValidate(...args);

    // post-process our value added directives
    if (pruneDupPaths && joiResult.error) {
      joiResult.error.details = joiResult.error.details.filter( (elm, indx, arr) => {
        return indx === 0 || elm.path !== arr[indx-1].path;
      });
    }

    // beam me up scotty :-)
    return joiResult;
  };

}

export default Joi;

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
