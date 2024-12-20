const express = require("express");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const { isAuthenticated } = require("../middlewares/auth"); // Middleware pour vérifier la connexion
const router = express.Router();

// Afficher tous les articles
router.get("/", async (req, res) => {
  const articles = await Article.find().populate("author").sort({ createdAt: -1 });
  res.render("articles/index", { articles });
});

// Formulaire pour créer un nouvel article
router.get("/new", isAuthenticated, (req, res) => {
  res.render("articles/new");
});

// Enregistrer un nouvel article
router.post("/", isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const article = new Article({
    title,
    content,
    author: req.session.userId,
  });
  await article.save();
  res.redirect("/articles");
});

// Afficher un article spécifique avec ses commentaires
router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate("author")
    .populate({
      path: "comments",
      populate: { path: "author" },
    });
  res.render("articles/show", { article });
});

// Ajouter un commentaire à un article
router.post("/:id/comments", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  const comment = new Comment({
    content,
    author: req.session.userId,
    article: req.params.id,
  });
  await comment.save();

  // Ajouter le commentaire à l'article
  const article = await Article.findById(req.params.id);
  article.comments.push(comment);
  await article.save();

  res.redirect(`/articles/${req.params.id}`);
});

module.exports = router;
