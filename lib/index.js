const assert = require('assert');
const helper = require('think-helper');
const SwaggerParser = require('./think-swagger-parser');



think.app.once('appReady', () => {

});

function invokeParser(options, app) {
  app.think.beforeStartServer(async() => {
    var apiDoc = think.config('api_doc');
    var controllerDir = think.config('controller_dir');
    var handler = function (descs) {
      think.app.apiDescs = descs;
      // console.log('parser think.app.apiDescs=' + JSON.stringify(parser.getDescs()));
    };
    var opt = {
      // API文档路径
      doc: apiDoc || './api/example.yaml',
      // controllers的目录
      controller_dir: controllerDir || './app/controller',
      // 对接口做版本控制
      versioning: true,
      // 展示api-explorer
      apiExplorerVisible: true,
      handler: handler
    };
    // console.log('create SwaggerParser');
    var parser = new SwaggerParser(opt);
    return parser.load(handler);
    // parser.load().then(()=>{
  });
  //   think.app.apiDescs = parser.getDescs();
  return (ctx, next) => {
    return next();
  };
  // });

};

module.exports = invokeParser;