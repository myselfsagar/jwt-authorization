const express = require("express");
const dbConnect = require("./config/dbConnect");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mainRoutes = require("./routes/mainRoutes");
const app = express();

dbConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());

const origin = process.env.CLIENT_BASE_URL;
app.use(
  cors({
    credentials: true,
    origin,
  })
);

app.use("/api", mainRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Listening from PORT :", PORT);
});
