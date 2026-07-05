const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

console.log("userController:", userController);

router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    console.log("ERROR:", err);
    console.log("USER:", user);
    console.log("INFO:", info);

    if (err) return next(err);

    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return userController.login(req, res);
    });

  })(req, res, next);
});

router.get("/logout", userController.logout);

module.exports = router;