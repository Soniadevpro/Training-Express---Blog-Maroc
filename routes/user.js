const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Inscription
router.get("/register", (req, res) => res.render("auth/register"));
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/user/login");
  } catch (err) {
    console.error(err);
    res.redirect("/user/register");
  }
});

// Connexion
router.get("/login", (req, res) => res.render("auth/login"));
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.userId = user._id;
      res.redirect("/");
    } else {
      res.redirect("/user/login");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/user/login");
  }
});

// Déconnexion
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
