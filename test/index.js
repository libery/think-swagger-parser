import test from 'ava';
import invokeParser from '../lib/index.js';

test('empty options.api_doc', t => {
  const fn = invokeParser({}, {
    think:{
      beforeStartServer: function(){

      }
    }
  });
  const error = t.throws(() => fn({}));
//   t.is(error.message, 'empty options.api_doc');
// });

// test('empty options.controller_dir', t => {
//   const fn = invokeParser({
//     api_doc:'./api/swagger.yaml'
//   }, {});
//   const error = t.throws(() => fn({}));
//   t.is(error.message, 'empty options.controller_dir');
// });
