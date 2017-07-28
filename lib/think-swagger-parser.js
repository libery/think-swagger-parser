var _ = require('lodash');
var Debug = require('debug');
var swaggerParser = require('swagger-parser');
var path = require('path');

var Utils = require('./util/string');
var Parameters = require('./validator/parameters');
var Responses = require('./validator/responses');

const debug = new Debug('swagger-desc');

module.exports = class ThinkSwaggerParser {
  constructor(options) {
    this.doc = options.doc || './api/swagger.yaml';
    this.controller_dir = options.controller_dir || './app/controller';
    this.versioning = options.versioning === undefined ? true : options.versioning;
    this.jsonSchemaFormatters = options.jsonSchemaFormatters;
    this.errorHandler = options.errorHandler;
    this.defaultResponseSchemas = options.defaultResponseSchemas;
    this.handler = options.handler;
    this.descs = [];
  }
  getDescs() {
    return this.descs;
  }
  init(api) {
    this.api = api;

    debug('api doc', this.api);
    for (const endpoint in this.api.paths) {
      const endpointDetail = this.api.paths[endpoint];
      for (const method in endpointDetail) {
        this._hookEndpoint_(method, endpoint, endpointDetail[method]);
      }
    }
    this.handler(this.descs);
  }

  async load(resolve, reject) {
    var self = this;
    return new Promise((resolve, reject) => {
      swaggerParser.validate(self.doc, {
          validate: {
            schema: false,
            spec: false
          }
        }, function (err, api) {
        if (err) {
          reject('swagger document parse or validate error.');
        } else {
           self.init(api);
           resolve(self.descs);
        }
      });
    });
  }
  /**
   * 加载服务接口
   * 
   * @param {any} method 
   * @param {any} endpoint 
   * @param {any} detail 
   */
  _hookEndpoint_(method, endpoint, detail) {
    const apiPath = Utils.routerFormat(Utils.versionApi(!!this.versioning, this.api.info.version, this.api.basePath, endpoint));
    debug(`mount ${method} ${apiPath}`);

    const respValidator = new Responses(detail, this.validator, this.errorHandler, this.defaultResponseSchemas);
    const paramValidator = new Parameters(detail, this.validator, this.jsonSchemaFormatters);
    const controllers = detail['x-think-controller'] || detail['x-controller'];
    const handlers = this._loadHandlers(detail['x-think-controller'] || detail['x-controller']);
    const desc = {
      method: method,
      apiPath: apiPath,
      paramValidator: paramValidator,
      controllers: controllers
    };

    this.descs.push(desc);
  }
  /**
   * 加载所有的handler
   * 
   * @param {any} controllers 
   * @returns 
   */
  _loadHandlers(controllers) {
    const handlers = [];
    for (const data of controllers) {
      const handler = this._loadHandler(data);
      handlers.push(handler);
    }

    debug('load user custom handlers: ', handlers);
    return handlers;
  }
  /**
   * 加载handler
   * 
   * @param {any} {
   *     file,
   *     handler
   *   } 
   * @returns 
   */
  _loadHandler({
    file,
    handler
  }) {
    if (!file && _.isFunction(handler)) {
      return handler;
    } else {
      const modulePath = path.resolve(this.controller_dir, file);
      const moduleController = require(modulePath);
      const controller = new moduleController();

      if (!controller || 'function' !== typeof (controller[handler]))
        throw new Error(`module [${modulePath}] has no function [${handler}]`)

      return controller[handler];
    }
  }

}