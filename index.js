const express = require("express");
const app = express();
const mongoose = require("mongoose");
// var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
//Import Routes
const mobilityRoute = require("./routes/mobility");

const port = process.env.PORT || 3000;

//Connect to DB
try {
  mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
  );
} catch (e) {
  console.log(e);
}

//MiddleWare
app.use(express.json());
// app.use(cors());

//Route Middlewares
app.use("/api/mobility", mobilityRoute);

app.listen(port, () => console.log("Running User Server"));
