import SprintServer from "../src/index.js";

const app = new SprintServer();

const router = app.Router();

router.get(
  "/",
  (req, res, proceed) => {
    console.log("authenticating request");
    proceed();
  },
  (req, res, next) => {
    console.log("validating role");
  },
  (req, resp) => {
    resp.send("This is the first request test /");
  }
);

export default app;
