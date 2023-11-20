const jwt = require("jsonwebtoken");

const isUserAuthorized = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      req.currentUser = jwt.verify(token, "s3cret");
      next();
      return;
    } else {
      res.json({
        error: "ERROR! : PLease sign In",
      });
    }
  } catch {
    res.json({
      error: "Error : Unauthorized Request",
    });
  }
};

module.exports = isUserAuthorized;
