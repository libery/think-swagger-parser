const SwaggerParser = require('./think-swagger-parser');


function invokeParser(options, app) {
  app.think.beforeStartServer(async() => {
    var apiDoc = think.config('api_doc');
    var controllerDir = think.config('controller_dir');
    var handler = function (descs) {
      think.app.apiDescs = descs;
    };
    var opt = {
      doc: apiDoc || './api/swagger.yaml',
      controller_dir: controllerDir || './app/controller',
      versioning: true,
      handler: handler
    };
    var parser = new SwaggerParser(opt);
    return parser.load(handler);
  });
  return (ctx, next) => {
    return next();
  };
};

module.exports = invokeParser;