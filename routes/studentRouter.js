const express = require("express");
const studentModel = require("../model/studentModel");
const studentRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isUserAuthorized = require("../middleware/isuserAuthorized");

studentRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  existingUser = await studentModel.findOne({ username: username }).exec();
  if (existingUser) {
    res.json({
      error: "Error : Username already exisis",
    });
  } else {
    const hash = bcrypt.hashSync(password, 10);
    const newstudent = new studentModel({
      username: username,
      passwordHash: hash,
    });
    await newstudent.save();
    res.json({
      message: "User created",
    });
  }
});

studentRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  existingUser = await studentModel.findOne({ username: username }).exec();
  if (!existingUser) {
    res.json({
      error: "Error username doesnt exist",
    });
  } else {
    const isPasswordMatch = bcrypt.compareSync(password, existingUser.passwordHash);
    if (!isPasswordMatch) {
      res.json({
        error: "Error! Invalid Password",
      });
    } else {
      const token = jwt.sign(
        {
          userId: existingUser._id,
          username: existingUser.username,
        },
        "s3cret"
      );
      res.set("authorization", token);
      res.json({
        message: "Sign In successful",
      });
    }
  }
});
studentRouter.get("/user", isUserAuthorized, async (req, res) => {
  const { userId, username } = req.currentUser;
  res.json({
    userId: userId,
    username: username,
  });
});

studentRouter.get("/others", isUserAuthorized, async (req, res) => {
  const allstudents = await studentModel.find().exec();
  console.log(allstudents);
  const otherStudents = allstudents.filter((student) => {
    // console.log(student._id.toString(), req.currentUser.userId);
    return student._id.toString() !== req.currentUser.userId;
  });
  const otherStudentsDetails = otherStudents.map((student) => {
    return {
      userId: student._id,
      username: student.username,
    };
  });
  res.json(otherStudentsDetails);
});
module.exports = studentRouter;
