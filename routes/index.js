const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// landing page or login  page
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "layouts/login",
  });
});

// get /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    name: req.user.firstName,
  });
});

router.get("/stories", ensureAuth, (req, res) => {
  res.render("stories");
});

module.exports = router;
