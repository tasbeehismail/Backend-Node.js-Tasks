import { Router } from "express";
const app = Router();
import APIS from "./apis.routes.js";

app.use("/api/", APIS);

app.get("*", function (req, res) {
  res.format({
    html: function (req, res) {
      res.status(200).send("done!");
    },
    json: function (req, res) {
      res.json({
        message: "done!",
      });
    },
  });
});

export default app;