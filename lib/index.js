const SwaggerParser = require('./think-swagger-parser');


function invokeParser(options, app) {
  app.think.beforeStartServer(async() => {
    var apiDoc = options.api_doc; //app.think.config('api_doc');
    var controllerDir = options.controller_dir; //app.think.config('controller_dir'); 
    var handler = function (descs) {
      app.apiDescs = descs;
    };
    var opt = {
      doc: apiDoc || './api/swagger.yaml',
      controller_dir: controllerDir || './app/controller',
      versioning: true,
      handler: handler
    };
    var parser = new SwaggerParser(opt);
    await parser.load(handler);
  });
  return (ctx, next) => {
    return next();
  };
};

module.exports = invokeParser;