# Usage

## Example

const app = new SprintServer();
const router = app.Router();

router.get(
  "/",
  (req, res, proceed) => {
    console.log('testing');
    proceed()
  },
  (req, resp, proceed) => {
    req.new = "setting this newly";
    console.log("middleware...");
  },
  (req, resp) => {
    resp.send("getting /");
  }
);

router.get("/home", (req, resp) => {
  resp.json("getting /home");
});

router.post("/", (req, resp, proceed) => {
  const data = req.body;

  resp.json({
    data: {
      name: data.name,
      email: data.email,
      status: "new user",
      date: Date.now(),
    },
  });
});

app.listen(1234, () => {
  console.log("server spinning at port 1234");
});
