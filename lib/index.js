const SwaggerParser = require('./think-swagger-parser');


function invokeParser(options, app) {
  var apiDoc = options.api_doc; //app.think.config('api_doc');
  var controllerDir = options.controller_dir; //app.think.config('controller_dir'); 
  app.think.beforeStartServer(async() => {
    var handler = function (descs) {
      app.apiDescs = descs;
    };
    var opt = {
      doc: apiDoc || './api/swagger.yaml',
      controller_dir: controllerDir || './app/controller',
      versioning: true,
      handler: handler
    };
    assert(opt.doc.length===0, 'empty options.api_doc');
    assert(opt.controller_dir.length===0, 'empty options.controller_dir');
    var parser = new SwaggerParser(opt);
    await parser.load(handler);
  });
  return (ctx, next) => {
    return next();
  };
};

module.exports = invokeParser;