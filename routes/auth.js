const express = require("express");
const passport = require("passport");
const router = express.Router();

// auth with google
// get /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// google callback
// auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc logout user
// router /auth/logout
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
