const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isAdmin,
  validateListing,
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Debug logs
console.log("index:", typeof listingController.index);
console.log("renderNewForm:", typeof listingController.renderNewForm);
console.log("createListing:", typeof listingController.createListing);
console.log("showListing:", typeof listingController.showListing);
console.log("renderEditForm:", typeof listingController.renderEditForm);
console.log("updateListing:", typeof listingController.updateListing);
console.log("destroyListing:", typeof listingController.destroyListing);

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isAdmin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
)

// NEW
router.get(
  "/new",
  isLoggedIn,
  isAdmin,
  listingController.renderNewForm
);
// STATE PAGE (IMPORTANT: id route se pehle)
router.get("/states/:state", async (req, res) => {
  const { state } = req.params;

  const places = await Listing.find({
    state: state,
  });

  res.render("listings/state", {
    places,
    state,
  });
});



// EDIT FORM

router.get("/states/test", (req, res) => {
  res.send("State Route Working");
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isAdmin,
  wrapAsync(listingController.renderEditForm)
);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isAdmin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isAdmin,
    wrapAsync(listingController.destroyListing)
);
 

module.exports = router;