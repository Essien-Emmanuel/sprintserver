function listen(port = 8080, cb) {
  const self = this;

  const server = http.createServer(function (req, resp) {
    if (!req.method) {
      throw new Error("Http method is not specified");
    }

    if (!req.url) {
      throw new Error("request url is not specified");
    }
    if (!Object.keys(self.routers).includes(req.method.toLowerCase())) {
      throw new Error("Not found");
    }

    const targetRoute = self.routers[req.method.toLowerCase()];

    if (!targetRoute[req.url]) {
      resp.end("Endpoint not found");
      return;
    }

    const endpoint = targetRoute[req.url];
    const targetHandler = endpoint["reqHandler"];
    const middlewares = endpoint["middlewares"];
    const extResp = SSResponse(req, resp);

    function createProceedFn(req, resp) {
      // req.middlewareProceed = false;
      // return function () {
      //   req.middlewareProceed = true;
      //   return { req, resp };
      // };
    }

    function runMiddlewares(req, middlewares, resp) {
      // let proceed = createProceedFn(req, resp);
      // resp.prevEnd = resp.end.bind(resp);
      // resp.end = function () {
      //   this.ended = true;
      //   this.prevEnd(...arguments);
      // };

      for (const middleware of middlewares) {
        // req.middlewareProceed = false;
        const proceed = () => {};

        middleware(req, resp, proceed);
        // if (resp.ended) {
        //   console.log("Response ended... breaking.");
        //   break;
        // }
        if (!req.middlewareProceed) break;
      }
    }

    //run middlewares
    if ("middlewares" in endpoint) {
      runMiddlewares(req, middlewares, extResp);
    }

    // console.log(req.new);
    // return resp.ended ? null : targetHandler(req, extResp);
    req.proceed ? targetHandler(req, extResp) : null;
    // targetHandler(req, extResp);
  });

  server.listen(port, cb());
}
