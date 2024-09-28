import SprintServer from "../src/index.js";

const app = new SprintServer();

const router = app.Router();

router.get(
  "/",
  () => {},
  (req, resp) => {
    resp.send("getting anoterh /");
  }
);

export default app;
