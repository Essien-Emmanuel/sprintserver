"use strict";

import http from "http";

export function SSResponse(req, resp) {
  resp.send = function (body) {
    if (resp.isSend) {
      console.log(
        "Check Middleware responses. Cannot write headers after they are sent to the client"
      );
      return;
    }
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.write(body);
    resp.end();
    resp.isSend = true;
    return this;
  };

  resp.json = function (body) {
    if (resp.isSend) {
      console.log(
        "Check Middleware responses. Cannot write headers after they are sent to the client"
      );
      return;
    }
    console.log(body);
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify(body));
    resp.end();
    resp.isSend = true;
    return this;
  };

  return resp;
}

class SprintServer {
  constructor() {
    this.routers = {
      get: {},
    };
  }

  _get(url, reqHandler) {
    this.routers.get[url] = reqHandler;
  }

  get(url, ...middlewares) {
    this.routers.get[url] = {};

    if (middlewares.length < 1) {
      throw new Error("No request handler found");
    }

    if (middlewares.length === 1) {
      this.routers.get[url]["reqHandler"] = middlewares[0];
      return;
    }

    if (middlewares.length > 1) {
      this.routers.get[url]["reqHandler"] = middlewares.pop();
      this.routers.get[url]["middlewares"] = middlewares;
      return;
    }
  }

  Router() {
    const self = this;
    return {
      get: self.get.bind(self),
    };
  }

  use() {
    console.log("using middleware...");
  }

  listen(port = 8080, cb) {
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

      resp.isSend = false;

      const endpoint = targetRoute[req.url];
      const targetHandler = endpoint["reqHandler"];
      const middlewares = endpoint["middlewares"];
      const extResp = SSResponse(req, resp);

      function runMiddlewares(req, middlewares, resp) {
        const createProceedFn = (req) => {
          return () => {
            req.proceed = true;
          };
        };

        for (const middleware of middlewares) {
          req.proceed = false;
          const proceed = createProceedFn(req);
          middleware(req, resp, proceed);

          if (!req.proceed) break;
        }
      }

      //run middlewares
      if ("middlewares" in endpoint) {
        runMiddlewares(req, middlewares, extResp);
      }
      targetHandler(req, extResp);
    });

    server.listen(port, cb());
  }
}

/** usage */
const app = new SprintServer();
const router = app.Router();

router.get(
  "/",
  (req, resp, proceed) => {
    req.new = "setting this newly";
    console.log("middleware...");
    proceed();
  },
  (req, resp, proceed) => {
    req.new = "setting this newly";
    console.log("middleware 2...");
    // resp.end("ended");
    proceed();
  },
  (req, resp, proceed) => {
    req.new = "setting this newly";
    console.log("middleware 3...");
    // resp.send("bypass");
    // proceed();
  },
  (req, resp) => {
    resp.send("getting /");
  }
);

router.get("/home", (req, resp) => {
  resp.json("getting /home");
});

app.listen(1234, () => {
  console.log("server spinning at port 1234");
});

export default SprintServer;
