const express = require("express");
const dbConnect = require("./config/dbConnect");
const initRoutes = require("./routers");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
dbConnect();
initRoutes(app);

app.listen(port, () => {
  console.log("Server running on the port: " + port);
});
