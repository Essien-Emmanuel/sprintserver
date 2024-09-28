import http from "http";

export function SSResponse(resp) {
  resp.send = function (body) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.write(body);
    resp.end();
    return this;
  };

  resp.json = function (body) {
    console.log(body);
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify(body));
    resp.end();
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
      this.routers.get[url]["middlewares"] = middlewares.slice(0, -1);
      this.routers.get[url]["reqHandler"] = middlewares[middlewares.length - 1];
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
      console.log("here");
      if (!req.method) {
        throw new Error("Http method is not specified");
      }

      if (!req.url) {
        throw new Error("request url is not specified");
      }
      if (!Object.keys(self.routers).includes(req.method.toLowerCase())) {
        throw new Error("Not found");
      }

      const extResp = SSResponse(resp);

      const targetRoute = self.routers[req.method.toLowerCase()];
      if (!targetRoute[req.url]) {
        resp.end("Endpoint not found");
        return;
      }
      const targetHandler = targetRoute[req.url];
      console.log(targetRoute);
      return targetHandler(req, extResp);
    });

    server.listen(port, cb());
  }
}

/** usage */
const app = new SprintServer();
const router = app.Router();

router.get(
  "/",
  () => {
    console.log("middleware");
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
