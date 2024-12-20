const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Formulaire d'inscription
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Traitement de l'inscription
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
  }
});

// Formulaire de connexion
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Traitement de la connexion
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.userId = user._id;
      res.redirect("/dashboard");
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/auth/login");
  }
});

// Déconnexion
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
