const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("./auth-model.js");
const jwt = require("jsonwebtoken");
const restricted = require("./authenticate-middleware");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.addUser(user)
    .then(saved => {
      res.status(201).json({ message: `Welcome ${user.username}!` });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error while adding user" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({ message: `Welcome ${user.username}!`, token });
      } else {
        res.status(401).json({ message: "Invalid credentials on login" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "server crashed whilte trying to login" });
    });
});

function signToken(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET || "keep it secret and safe!";

  const options = {
    expiresIn: `1h`
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
