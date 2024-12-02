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

async function bodyParser(req) {
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      const reqBody = chunk.toString();
      const bodyObj = JSON.parse(reqBody);
      return resolve(bodyObj);
    });
  });
}

class SprintServer {
  constructor() {
    this.routers = {
      get: {},
      post: {},
      put: {},
      patch: {},
      delete: {},
    };
  }

  mapMethod(httpMtd) {
    return (url, ...middlewares) => {
      this.routers[`${httpMtd}`][url] = {};

      if (middlewares.length < 1) {
        throw new Error("No request handler found");
      }

      if (middlewares.length === 1) {
        this.routers[`${httpMtd}`][url]["reqHandler"] = middlewares[0];
        return;
      }

      if (middlewares.length > 1) {
        this.routers[`${httpMtd}`][url]["reqHandler"] = middlewares.pop();
        this.routers[`${httpMtd}`][url]["middlewares"] = middlewares;
        return;
      }
    };
  }

  Router() {
    const self = this;
    return {
      get: self.mapMethod("get").bind(self),
      post: self.mapMethod("post").bind(self),
      put: self.mapMethod("put").bind(self),
      patch: self.mapMethod("patch").bind(self),
      delete: self.mapMethod("delete").bind(self),
    };
  }

  use(middlewareFn) {
    console.log("using middleware...", middlewareFn);
  }

  listen(port = 8080, cb) {
    const self = this;

    const server = http.createServer(async function (req, resp) {
      if (!req.method) {
        throw new Error("Http method is not specified");
      }

      if (!req.url) {
        throw new Error("request url is not specified");
      }
      if (!Object.keys(self.routers).includes(req.method.toLowerCase())) {
        throw new Error("Not found");
      }

      // use middlewares

      //
      const reqBody = await bodyParser(req);
      req.body = reqBody;

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
// const app = new SprintServer();
// const router = app.Router();

// router.get(
//   "/",
//   (req, res, proceed) => {
//     console.log('testing');
//     proceed()
//   },
//   (req, resp, proceed) => {
//     req.new = "setting this newly";
//     console.log("middleware...");
//   },
//   (req, resp) => {
//     resp.send("getting /");
//   }
// );

// router.get("/home", (req, resp) => {
//   resp.json("getting /home");
// });

// router.post("/", (req, resp, proceed) => {
//   const data = req.body;

//   resp.json({
//     data: {
//       name: data.name,
//       email: data.email,
//       status: "new user",
//       date: Date.now(),
//     },
//   });
// });

// app.listen(1234, () => {
//   console.log("server spinning at port 1234");
// });

export default SprintServer;
