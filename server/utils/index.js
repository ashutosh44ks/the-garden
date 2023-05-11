const jwt = require("jsonwebtoken");
const fs = require("fs");
const Users = require("../models/users");

const addToAverage = (oldAvg, oldCount, newValue) => {
  return (oldAvg * oldCount + newValue) / (oldCount + 1);
};
const replaceInAverage = (oldAvg, oldCount, oldValue, newValue) => {
  return (oldAvg * oldCount - oldValue + newValue) / oldCount;
};
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30min",
  });
};
function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (let i in files) {
    const name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      const fileSize = fs.statSync(name).size;
      files_.push({ dbFileName: files[i], size: fileSize });
    }
  }
  return files_;
}

// middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // this is "Bearer token"
  const token = authHeader && authHeader.split(" ")[1]; // this is the "token"

  if (token == null) return res.sendStatus(401); // if there is no token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is not valid
    req.user = user; // if the token is valid
    next();
  });
}

async function forModOnly(req, res, next) {
  const username = req.user.username;
  try {
    const user = await Users.findOne({ username });
    if (user == null) {
      return res.status(404).json({ msg: "Cannot find user" });
    }
    if (user.role === "user")
      return res.status(401).json({
        msg: "Unauthorised, this route is only allowed for special users",
      });
    next();
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
}

module.exports = {
  addToAverage,
  replaceInAverage,
  generateAccessToken,
  authenticateToken,
  forModOnly,
  getFiles,
};
