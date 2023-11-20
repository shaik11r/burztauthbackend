const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRouter = require("./routes/studentRouter");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);
app.use(express.json());

app.use("/students", studentRouter);
const url = "mongodb+srv://nadeenshaik:nadeen@cluster0.a4ieaf1.mongodb.net/studentDetails";
const connectToDbAndStart = async () => {
  await mongoose.connect(url);
  console.log("Connected to DB ");
  app.listen(8000);
};
connectToDbAndStart();
