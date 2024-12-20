const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const User = require("./models/User");
const app = express();

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/blog-maroc")
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

// Configuration du middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Configuration des sessions
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Route d'accueil
app.get("/", (req, res) => {
  res.render("index", { title: "Accueil - Blog Maroc" });
});
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const articleRoutes = require("./routes/article");
app.use("/articles", articleRoutes);
const { isAuthenticated } = require("./middlewares/auth");

app.get("/profile", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("profile", { user });
});
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/dashboard", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("dashboard", { user });
});
// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
