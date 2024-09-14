import http from "http";

class App {
  constructor() {
    this.routers = {
      get: {},
    };
  }

  get(url, reqHandler) {
    // this.routers.get.push({ url, reqHandler });
    this.routers.get[url] = reqHandler;
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
  listen(port = 8080, host = "127.0.0.1", cb) {
    const self = this;
    const server = http.createServer(function (req, resp) {
      // if GET
      //if POST
      // if PUT
      //if DELETE
      //if PATCH
      //if OPTIONs
      // self.reqHandler(req, resp);
      const targetRoute = self.routers[req.method.toLowerCase()];
      if (!targetRoute[req.url]) {
        resp.end("Endpoint not found");
      }
      const targetHandler = targetRoute[req.url];
      targetHandler(req, resp);
      // const endpointCount = targetRoute.reduce((acc, endpoint) => {
      //   if (endpoint.url === req.url) {
      //     endpoint.reqHandler(req, resp);
      //     return ++acc;
      //   }
      //   return acc;
      // }, 0);

      // if (endpointCount < 1) {
      //   resp.end("Endpoint not found");
      // }
    });

    server.listen(port, host, cb());
  }
}

const app = new App();
const router = app.Router();

router.get("/", (req, resp) => {
  resp.end("getting /");
  // resp.setHeader("Content-Type", "application/json");
  // console.log(req.method);
  // resp.writeHead(200, { "Content-Type": "application/json" });
  // resp.write(JSON.stringify({ msg: "hello" }));
  // resp.end("OK");
});

router.get("/home", (req, resp) => {
  resp.end("getting /home");
});

app.listen(1234, "127.0.0.1", () => {
  console.log("server spinning at port 1234");
});
